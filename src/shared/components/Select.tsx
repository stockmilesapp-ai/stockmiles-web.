import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

// A select that a native <select> cannot be: options with an icon and a
// description, single or multiple choice, a search box, and Cancel / Apply.
//
// Choices are made on a draft while the list is open. Apply hands the draft to
// onChange; Cancel, Escape and a click outside throw it away.
//
// The list is drawn in a portal on <body>, so a parent with overflow hidden
// (a card, a table, a dialog) cannot cut it off. It opens below the field,
// or above it when there is more room there.
//
//   <Select options={roles} value={role} onChange={setRole} />
//   <Select multiple options={stores} value={storeIds} onChange={setStoreIds} />
//
// onChange also receives the chosen option objects, including any extra
// fields they carry:
//
//   onChange={(value, option) => open(option?.component)}

export type SelectOption<V extends string = string> = {
  value: V;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
};

// O is the caller's option type, so extra fields on the options (for example a
// component to show) come back typed in onChange.
type CommonProps<V extends string, O extends SelectOption<V>> = {
  options: O[];
  placeholder?: string;
  // Shows a search box above the options; off by default.
  searchable?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
  applyLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

type SingleSelectProps<V extends string, O extends SelectOption<V>> =
  CommonProps<V, O> & {
    multiple?: false;
    value: V | null;
    onChange: (value: V | null, option: O | null) => void;
  };

type MultiSelectProps<V extends string, O extends SelectOption<V>> =
  CommonProps<V, O> & {
    multiple: true;
    value: V[];
    onChange: (value: V[], options: O[]) => void;
  };

export type SelectProps<
  V extends string = string,
  O extends SelectOption<V> = SelectOption<V>,
> = SingleSelectProps<V, O> | MultiSelectProps<V, O>;

// Narrow fields (a filter cell) still get a list wide enough to read.
const MIN_LIST_WIDTH = 256;

function join(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function matches(option: SelectOption, query: string) {
  const text = `${option.label} ${option.description ?? ""}`.toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

function Select<
  V extends string,
  O extends SelectOption<V> = SelectOption<V>,
>(props: SelectProps<V, O>) {
  const {
    options,
    placeholder = "Select…",
    searchable = false,
    searchPlaceholder = "Search…",
    noResultsText = "No matches",
    applyLabel = "Apply",
    cancelLabel = "Cancel",
    disabled = false,
    id,
    className,
  } = props;
  const multiple = props.multiple === true;
  const selected: V[] = props.multiple
    ? props.value
    : props.value === null
      ? []
      : [props.value];

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<V[]>([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<CSSProperties | null>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  const visible = useMemo(
    () => options.filter((option) => matches(option, query)),
    [options, query],
  );

  function firstEnabled(list: SelectOption<V>[], from = 0, step = 1) {
    for (let i = from; i >= 0 && i < list.length; i += step) {
      if (!list[i].disabled) return i;
    }
    return -1;
  }

  function openList() {
    if (disabled) return;
    setPosition(null);
    setDraft(selected);
    setQuery("");
    setActiveIndex(firstEnabled(options));
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function apply() {
    const chosenOptions = options.filter((option) =>
      draft.includes(option.value),
    );
    if (props.multiple) {
      props.onChange(draft, chosenOptions);
    } else {
      props.onChange(draft[0] ?? null, chosenOptions[0] ?? null);
    }
    closeList();
  }

  function toggle(option: SelectOption<V>) {
    if (option.disabled) return;
    if (multiple) {
      setDraft((current) =>
        current.includes(option.value)
          ? current.filter((value) => value !== option.value)
          : [...current, option.value],
      );
    } else {
      setDraft([option.value]);
    }
  }

  // Close (without applying) on a click anywhere outside the component.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Place the list next to the field, and keep it there while the page
  // scrolls or resizes. The first render is hidden so its height is known.
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const field = triggerRef.current?.getBoundingClientRect();
      const height = popoverRef.current?.offsetHeight ?? 0;
      if (!field) return;
      const gap = 8;
      const viewportWidth = document.documentElement.clientWidth;
      const roomBelow = window.innerHeight - field.bottom;
      const opensUp = roomBelow < height + gap * 2 && field.top > roomBelow;
      // As wide as the field, at least MIN_LIST_WIDTH, never wider than the
      // screen. Near the right edge, line up with the field's right side.
      const width = Math.min(
        Math.max(field.width, MIN_LIST_WIDTH),
        viewportWidth - gap * 2,
      );
      const fitsRight = field.left + width <= viewportWidth - gap;
      const left = fitsRight
        ? field.left
        : Math.max(gap, Math.min(field.right, viewportWidth - gap) - width);
      setPosition({
        top: opensUp ? field.top - height - gap : field.bottom + gap,
        left,
        width,
      });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, visible.length]);

  // Put the cursor in the search box, or on the list when there is none.
  // Wait until the list is placed: a hidden element cannot take focus.
  const placed = position !== null;
  useEffect(() => {
    if (!open || !placed) return;
    (searchable ? searchRef.current : listRef.current)?.focus();
  }, [open, placed, searchable]);

  // Keep the highlighted option in view while moving with the arrow keys.
  useEffect(() => {
    if (open && activeIndex >= 0) {
      document
        .getElementById(`${baseId}-option-${activeIndex}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeIndex, baseId]);

  function onSearchChange(text: string) {
    setQuery(text);
    setActiveIndex(
      firstEnabled(options.filter((option) => matches(option, text))),
    );
  }

  function onListKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = firstEnabled(visible, activeIndex + 1);
        if (next !== -1) setActiveIndex(next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const previous = firstEnabled(visible, activeIndex - 1, -1);
        if (previous !== -1) setActiveIndex(previous);
        break;
      }
      case "Enter":
        event.preventDefault();
        if (event.metaKey || event.ctrlKey) apply();
        else if (visible[activeIndex]) toggle(visible[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        closeList();
        break;
    }
  }

  const chosen = options.filter((option) => selected.includes(option.value));

  return (
    <div
      ref={rootRef}
      className={join("relative w-full font-normal", className)}
      // Inside a <label>, the browser would turn every click here into a
      // second click on the trigger and move focus back to it, closing the
      // list. Nothing in this component relies on a click's default action.
      onClick={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          closeList();
        }
      }}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-label={props["aria-label"]}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            openList();
          }
        }}
        className={join(
          "flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 text-left text-sm text-fg transition-colors",
          "hover:border-fg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none",
          open && "border-ring ring-2 ring-ring/30",
          "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-fg-muted",
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {chosen.length === 0 && (
            <span className="truncate text-fg-muted">{placeholder}</span>
          )}
          {!multiple && chosen[0] && (
            <>
              {chosen[0].icon && (
                <span className="shrink-0 text-fg-muted">{chosen[0].icon}</span>
              )}
              <span className="truncate">{chosen[0].label}</span>
            </>
          )}
          {multiple && chosen.length > 0 && (
            <>
              <span className="truncate">
                {chosen
                  .slice(0, 2)
                  .map((option) => option.label)
                  .join(", ")}
              </span>
              {chosen.length > 2 && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-strong">
                  +{chosen.length - 2}
                </span>
              )}
            </>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={join(
            "size-4 shrink-0 text-fg-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: "fixed",
              ...position,
              visibility: position ? "visible" : "hidden",
            }}
            className="z-50 overflow-hidden rounded-xl border border-border bg-surface font-sans font-normal text-fg shadow-lg"
          >
            {searchable && (
              <div className="flex items-center gap-2 border-b border-border px-3">
                <Search
                  aria-hidden="true"
                  className="size-4 shrink-0 text-fg-muted"
                />
                <input
                  ref={searchRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    activeIndex >= 0 ? optionId(activeIndex) : undefined
                  }
                  value={query}
                  placeholder={searchPlaceholder}
                  onChange={(event) => onSearchChange(event.target.value)}
                  onKeyDown={onListKeyDown}
                  className="min-h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted"
                />
              </div>
            )}

            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-activedescendant={
                !searchable && activeIndex >= 0
                  ? optionId(activeIndex)
                  : undefined
              }
              tabIndex={searchable ? -1 : 0}
              onKeyDown={searchable ? undefined : onListKeyDown}
              className="max-h-72 overflow-y-auto p-1 outline-none"
            >
              {visible.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-fg-muted">
                  {noResultsText}
                </li>
              )}
              {visible.map((option, index) => {
                const isSelected = draft.includes(option.value);
                return (
                  <li
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    onPointerMove={() =>
                      !option.disabled && setActiveIndex(index)
                    }
                    onClick={() => toggle(option)}
                    className={join(
                      "flex items-start gap-3 rounded-lg px-3 py-2 text-sm",
                      option.disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer",
                      index === activeIndex &&
                        !option.disabled &&
                        "bg-surface-2",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={join(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center border transition-colors",
                        multiple ? "rounded" : "rounded-full",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-fg-muted/50 bg-surface",
                      )}
                    >
                      {isSelected &&
                        (multiple ? (
                          <Check className="size-3" strokeWidth={3} />
                        ) : (
                          <span className="size-1.5 rounded-full bg-primary-foreground" />
                        ))}
                    </span>
                    {option.icon && (
                      <span className="mt-0.5 shrink-0 text-fg-muted">
                        {option.icon}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="font-medium text-fg">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="text-xs text-fg-muted">
                          {option.description}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2 border-t border-border bg-surface-2/50 px-3 py-2">
              {multiple && (
                <span className="text-xs text-fg-muted">
                  {draft.length} selected
                </span>
              )}
              <span className="flex-1" />
              <button
                type="button"
                onClick={closeList}
                className="min-h-9 cursor-pointer rounded-full px-4 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={apply}
                className="min-h-9 cursor-pointer rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {applyLabel}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default Select;
