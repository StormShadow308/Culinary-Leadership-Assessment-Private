'use client';

import { useRouter } from 'next/navigation';

import { Select } from '@mantine/core';

type Cohort = {
  id: string;
  name: string;
};

type CohortFilterProps = {
  cohorts: Cohort[];
  selected?: Cohort['id'];
};

export default function CohortFilter(props: CohortFilterProps) {
  const router = useRouter();

  const options = [
    { value: '', label: `All Cohorts (${props.cohorts.length})` },
    ...props.cohorts.map(cohort => ({ value: cohort.id, label: cohort.name })),
  ];

  const change = (value: string | null) => {
    const search = new URLSearchParams(location.search);

    if (value) {
      search.set('cohort', value);
    } else {
      search.delete('cohort');
    }

    router.replace(`?${search}`, {
      scroll: false,
    });
  };

  return (
    <Select
      placeholder="Pick Cohort"
      data={options}
      defaultValue={props.selected || ''}
      onChange={change}
      maxDropdownHeight={200}
      searchable
      clearable
    />
  );
}
