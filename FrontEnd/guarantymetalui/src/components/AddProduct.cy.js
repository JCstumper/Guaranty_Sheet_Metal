import React from 'react'
import AddProduct from './AddProduct'

describe('<AddProduct />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AddProduct />)
  })
})