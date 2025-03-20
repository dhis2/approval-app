import { useContext } from 'react'
import { SelectionContext } from './selection-context.js'

export const useSelectionContext = () => useContext(SelectionContext)
