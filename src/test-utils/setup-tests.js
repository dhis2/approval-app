import Adapter from '@cfaester/enzyme-adapter-react-18'
import { configure } from 'enzyme'
import '@testing-library/jest-dom'

configure({ adapter: new Adapter() })
