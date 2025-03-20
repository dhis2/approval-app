import { CssVariables } from '@dhis2/ui'
import React from 'react'
import { AppProvider } from '../app-context/index.js'
import { AuthWall } from '../auth/index.js'
import { BottomBar } from '../bottom-bar/index.js'
import { DataWorkspace } from '../data-workspace/index.js'
import { SelectionProvider } from '../selection-context/index.js'
import { TopBar } from '../top-bar/index.js'
import { WorkflowProvider } from '../workflow-context/index.js'
import { Layout } from './layout.js'

const App = () => (
    <>
        <CssVariables spacers colors theme />
        <AppProvider>
            <AuthWall>
                <SelectionProvider>
                    <Layout.Container>
                        <Layout.Top>
                            <TopBar />
                        </Layout.Top>
                        <WorkflowProvider>
                            <Layout.Content>
                                <DataWorkspace />
                            </Layout.Content>
                            <Layout.Bottom>
                                <BottomBar />
                            </Layout.Bottom>
                        </WorkflowProvider>
                    </Layout.Container>
                </SelectionProvider>
            </AuthWall>
        </AppProvider>
    </>
)

export { App }
