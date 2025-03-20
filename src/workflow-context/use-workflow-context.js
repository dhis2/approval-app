import { useContext } from 'react'
import { WorkflowContext } from './workflow-context.js'

export const useWorkflowContext = () => useContext(WorkflowContext)
