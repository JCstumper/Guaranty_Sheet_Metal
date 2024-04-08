import React from 'react'
import Inventory from './Inventory'

describe('<Inventory />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Inventory />)
  })
})