import { useState } from 'react';

import { Combobox, InputBase, useCombobox, ScrollArea } from '@mantine/core';

interface ComboboxComponentProps {
  data: Array<string>;
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  setData: React.Dispatch<React.SetStateAction<Array<string>>>;
  allowCreate?: boolean;
  placeholder?: string;
}

export function ComboboxComponent(props: ComboboxComponentProps) {
  const { data, setData, label, error, value, onChange, allowCreate = true, placeholder } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {
      combobox.updateSelectedOptionIndex();
    },
  });

  const [search, setSearch] = useState(value || '');

  const exactOptionMatch = data.some(item => item === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter(item => item.toLowerCase().includes(search.toLowerCase().trim()));

  const options = filteredOptions.map(item => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
        store={combobox}
        withinPortal={false}
        onOptionSubmit={val => {
          if (val === '$create') {
            setData(current => [...current, search]);
            onChange(search);
          } else {
            onChange(val);
            setSearch(val);
          }
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            label={label}
            required
            error={error}
            rightSection={<Combobox.Chevron />}
            value={search}
            onChange={event => {
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
              setSearch(event.currentTarget.value);
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => {
              combobox.closeDropdown();
              setSearch(value || '');
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                combobox.openDropdown();
                combobox.selectFirstOption();
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                combobox.openDropdown();
                combobox.selectLastOption();
              } else if (event.key === 'Enter') {
                event.preventDefault();
                if (combobox.dropdownOpened) {
                  combobox.selectOption(combobox.selectedOptionIndex);
                } else {
                  combobox.openDropdown();
                }
              } else if (event.key === 'Escape') {
                combobox.closeDropdown();
              }
            }}
            placeholder={placeholder || (allowCreate ? "Select or create a cohort" : "Select a cohort")}
            rightSectionPointerEvents="none"
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          <ScrollArea.Autosize mah={200} type="scroll" scrollbarSize={6}>
            <Combobox.Options>
              {options}
              {allowCreate && !exactOptionMatch && search.trim().length > 0 && (
                <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
              )}
              {filteredOptions.length === 0 && !allowCreate && (
                <Combobox.Option value="" disabled>
                  No cohorts found
                </Combobox.Option>
              )}
            </Combobox.Options>
          </ScrollArea.Autosize>
        </Combobox.Dropdown>
      </Combobox>
  );
}
