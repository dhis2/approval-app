import PropTypes from 'prop-types'
import React from 'react'
import styles from './retry-button.module.css'

export const RetryButton = ({ onClick, children }) => (
    <button className={styles.button} onClick={onClick}>
        {children}
    </button>
)

RetryButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
}
