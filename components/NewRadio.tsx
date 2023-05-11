import {RadioGroup} from "@headlessui/react";
import React from "react";

const newTypes = ['Piece', 'Category']

interface NewRadioProps {
  selected: string
  setSelected: (value: string) => void;
}
const NewRadio = ({selected, setSelected}:  NewRadioProps) => {
  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <div className="space-y-2">
        {newTypes.map((type) => (
          <RadioGroup.Option
            key={type}
            value={type}
            className={({ active, checked }) =>
              `${
                active
                  ? 'ring-2 ring-white ring-opacity-60'
                  : 'ring-2 ring-black ring-opacity-60'
              }
                  ${
                checked ? 'bg-opacity-75 text-white' : ''
              }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
            }
          >
            {({ checked }) => (
              <>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <RadioGroup.Label
                        as="p"
                        className={`font-medium  ${
                          checked ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {type}
                      </RadioGroup.Label>
                    </div>
                  </div>
                  {checked && (
                    <div className="shrink-0 text-white">
                      <CheckIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}

// @ts-ignore
function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default NewRadio