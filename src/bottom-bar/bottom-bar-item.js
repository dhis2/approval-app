import PropTypes from 'prop-types'
import React from 'react'
import styles from './bottom-bar-item.module.css'

const BottomBarItem = ({ children }) => {
    return <div className={styles.bottomBarItem}>{children}</div>
}

BottomBarItem.propTypes = {
    children: PropTypes.any.isRequired,
}

export { BottomBarItem }
