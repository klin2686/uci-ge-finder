import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import type { GECategory } from '../types/api';
import { GE_CATEGORIES } from '../types/api';

interface GESelectorProps {
  category1: GECategory | null;
  category2: GECategory | null;
  onCategory1Change: (category: GECategory | null) => void;
  onCategory2Change: (category: GECategory | null) => void;
}

const GESelector = ({
  category1,
  category2,
  onCategory1Change,
  onCategory2Change,
}: GESelectorProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Category 1:</label>
        <Listbox value={category1} onChange={onCategory1Change}>
          <div className="relative w-32">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-base-200 dark:bg-base-200 py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm border border-base-300">
              <span className="block truncate">
                {category1 || 'None'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-base-100 dark:bg-base-200 py-1 text-sm shadow-lg ring-1 ring-base-300 focus:outline-none border border-base-300">
                <Listbox.Option
                  key="none"
                  value={null}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-3 ${
                      active ? 'bg-primary/10' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      None
                    </span>
                  )}
                </Listbox.Option>
                {GE_CATEGORIES.map((category) => (
                  <Listbox.Option
                    key={category}
                    value={category}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 px-3 ${
                        active ? 'bg-primary/10' : ''
                      }`
                    }
                  >
                    {({ selected }) => (
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {category}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Category 2:</label>
        <Listbox value={category2} onChange={onCategory2Change}>
          <div className="relative w-32">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-base-200 dark:bg-base-200 py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm border border-base-300">
              <span className="block truncate">
                {category2 || 'None'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-base-100 dark:bg-base-200 py-1 text-sm shadow-lg ring-1 ring-base-300 focus:outline-none border border-base-300">
                <Listbox.Option
                  key="none"
                  value={null}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-3 ${
                      active ? 'bg-primary/10' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      None
                    </span>
                  )}
                </Listbox.Option>
                {GE_CATEGORIES.map((category) => (
                  <Listbox.Option
                    key={category}
                    value={category}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 px-3 ${
                        active ? 'bg-primary/10' : ''
                      }`
                    }
                  >
                    {({ selected }) => (
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {category}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
};

export default GESelector;
