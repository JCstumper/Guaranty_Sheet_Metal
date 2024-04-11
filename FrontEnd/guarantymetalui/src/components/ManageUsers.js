import React from 'react'
import ManageUsers from './ManageUsers'

describe('<ManageUsers />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ManageUsers />)
  })
})