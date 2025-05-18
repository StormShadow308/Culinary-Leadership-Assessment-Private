import { useState } from 'react';

import { Combobox, InputBase, useCombobox } from '@mantine/core';

interface ComboboxComponentProps {
  data: Array<string>;
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  setData: React.Dispatch<React.SetStateAction<Array<string>>>;
}

export function ComboboxComponent(props: ComboboxComponentProps) {
  const { data, setData, label, error, value, onChange } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
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
    <div>
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
            placeholder="Select or create a cohort"
            rightSectionPointerEvents="none"
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            {options}
            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
}
