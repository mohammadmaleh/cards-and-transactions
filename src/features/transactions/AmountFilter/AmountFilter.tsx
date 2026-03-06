import { useState } from "react"
import { z } from "zod"
import { Input } from "@/ui"
import { useUrlState } from "@/shared/hooks"

const filterAmountSchema = z.string().refine(
  (val) => val === "" || (Number.isFinite(Number(val)) && Number(val) >= 0),
  { message: "Amount must be a positive number" }
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
      placeholder="e.g. 50"
      type="text"
      inputMode="decimal"
      value={inputValue}
      onChange={handleChange}
      errorMessage={errorMessage}
    />
  )
}

export { AmountFilter }
