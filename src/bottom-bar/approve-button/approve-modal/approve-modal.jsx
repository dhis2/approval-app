import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useSelectionContext } from '../../../selection-context/index.js'
import styles from './approve-modal.module.css'

const ApproveModal = ({ onApprove, onCancel, error }) => {
    const { workflow } = useSelectionContext()
    const { dataSets } = workflow
    const count = dataSets.length

    return (
        <Modal>
            <ModalTitle>
                {count > 1
                    ? i18n.t('Approving {{count}} data sets', { count })
                    : i18n.t('Approving {{count}} data set', { count })}
            </ModalTitle>

            <ModalContent>
                <div className={styles.summary}>
                    <h1 className={styles.summaryTitle}>
                        {count > 1
                            ? i18n.t(
                                  '{{count}} data sets for workflow {{- workflow}}:',
                                  { count, workflow: workflow.displayName }
                              )
                            : i18n.t(
                                  '{{count}} data set for workflow {{- workflow}}:',
                                  { count, workflow: workflow.displayName }
                              )}
                    </h1>

                    <ul className={styles.summaryList}>
                        {dataSets.map(({ id, displayName }) => (
                            <li className={styles.summaryListItem} key={id}>
                                {displayName}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className={styles.confirmationStatement}>
                    {i18n.t('Are you sure you want to approve this data?')}
                </p>

                {error && (
                    <NoticeBox
                        error
                        title={i18n.t(
                            'There was a problem saving this approval'
                        )}
                    >
                        {i18n.t(
                            'This data couldn’t be approved. Try again, or contact your system administrator.'
                        )}
                    </NoticeBox>
                )}
            </ModalContent>

            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onCancel}>{i18n.t('Cancel')}</Button>

                    <Button primary onClick={onApprove}>
                        {i18n.t('Approve')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

ApproveModal.propTypes = {
    onApprove: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
}

export { ApproveModal }
