import { useState } from "react"
import { z } from "zod"
import { Input } from "@/ui"
import { useUrlState } from "@/shared/hooks"

const filterAmountSchema = z.string().refine(
  (val) => val === "" || /^[+-]?\d+(\.\d+)?$/.test(val),
  { message: "Enter a valid amount (e.g. 100, -100, +100)" }
)

function AmountFilter() {
  const [filterParam, setFilterParam] = useUrlState("filter")
  const [inputValue, setInputValue] = useState(filterParam)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)

    const result = filterAmountSchema.safeParse(raw)

    if (!result.success) {
      setErrorMessage(result.error.issues[0].message)
      return
    }

    setErrorMessage(undefined)
    setFilterParam({ filter: raw === "" ? null : raw })
  }

  return (
    <Input
      id="amount-filter"
      label="Amount Filter"
      placeholder="e.g. 100, -100, +100"
      type="text"
      inputMode="text"
      value={inputValue}
      onChange={handleChange}
      errorMessage={errorMessage}
    />
  )
}

export { AmountFilter }
