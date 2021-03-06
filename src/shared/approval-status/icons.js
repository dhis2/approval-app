import PropTypes from 'prop-types'
import React from 'react'

const Approved = ({ color }) => (
    <svg
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        color={color}
    >
        <path
            d="m7 10.707-2.5-2.5005.7065-.7065 1.7935 1.793 3.7925-3.793.7075.7075zm1-9.707c-3.86599325 0-7 3.13400675-7 7 0 3.8659932 3.13400675 7 7 7 3.8659932 0 7-3.1340068 7-7 0-1.85651543-.7374979-3.63699282-2.0502525-4.94974747-1.3127547-1.31275465-3.09323207-2.05025253-4.9497475-2.05025253zm0 13c-3.3137085 0-6-2.6862915-6-6s2.6862915-6 6-6 6 2.6862915 6 6c0 1.59129894-.632141 3.1174224-1.7573593 4.2426407s-2.65134176 1.7573593-4.2426407 1.7573593z"
            fill="currentColor"
            fillRule="evenodd"
        />
    </svg>
)

Approved.propTypes = {
    color: PropTypes.string,
}

const Ready = ({ color }) => (
    <svg
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        color={color}
    >
        <path
            d="m8 1c-.46686 0-.92352.04577-1.36559.13323l.19407.98099c.3785-.07488.77017-.11422 1.17152-.11422s.79302.03934 1.17152.11422l.19407-.98099c-.44207-.08746-.89873-.13323-1.36559-.13323zm-3.88966 1.17934c-.76315.51091-1.42009 1.16785-1.931 1.931l.83097.55632c.43819-.65453 1.00182-1.21816 1.65635-1.65635zm9.71036 1.931c-.511-.76315-1.1679-1.42009-1.931-1.931l-.5564.83097c.6546.43819 1.2182 1.00182 1.6564 1.65635zm1.1793 3.88966c0-.46686-.0458-.92352-.1332-1.36559l-.981.19407c.0749.3785.1142.77017.1142 1.17152s-.0393.79302-.1142 1.17152l.981.19407c.0874-.44207.1332-.89873.1332-1.36559zm-13.86677-1.36559c-.08746.44207-.13323.89873-.13323 1.36559s.04577.92352.13323 1.36559l.98099-.19407c-.07488-.3785-.11422-.77017-.11422-1.17152s.03934-.79302.11422-1.17152zm1.04611 5.25529c.51091.7631 1.16785 1.42 1.931 1.931l.55632-.831c-.65453-.4382-1.21816-1.0018-1.65635-1.6564zm9.71036 1.931c.7631-.511 1.42-1.1679 1.931-1.931l-.831-.5564c-.4382.6546-1.0018 1.2182-1.6564 1.6564zm-5.25529 1.0461c.44207.0874.89873.1332 1.36559.1332s.92352-.0458 1.36559-.1332l-.19407-.981c-.3785.0749-.77017.1142-1.17152.1142s-.79302-.0393-1.17152-.1142zm3.36559-6.8668c0 1.10457-.89543 2-2 2s-2-.89543-2-2 .89543-2 2-2 2 .89543 2 2zm1 0c0 1.65685-1.34315 3-3 3s-3-1.34315-3-3 1.34315-3 3-3 3 1.34315 3 3z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
        />
    </svg>
)

Ready.propTypes = {
    color: PropTypes.string,
}

const Waiting = ({ color }) => (
    <svg
        height="16"
        viewBox="0 0 16 16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        color={color}
    >
        <path
            d="M3 2H4H5H11H12H13V3H12V6.20711L10.2071 8L12 9.79289V13H13V14H12H11H5H4H3V13H4V9.79289L5.79289 8L4 6.20711V3H3V2ZM5 13H11V10.2071L8.79289 8L11 5.79289V3H5V5.79289L7.20711 8L5 10.2071V13Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
        />
    </svg>
)

Waiting.propTypes = {
    color: PropTypes.string,
}

export { Approved, Ready, Waiting }
