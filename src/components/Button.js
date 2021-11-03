import { ReactComponent as IconLoading } from '@assets/icons/loader.svg'
import { omit } from 'lodash'
import React, { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

const IconButton = styled(({ children, className, ...rest }) => (
  <button className={`button icon-button ${className}`} {...rest}>
    {children}
  </button>
))`
  border: none;
  padding: 0.335em;
  margin: 0;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;
  background: rgba(${({ theme }) => theme?.foreground}, 0.05);
  border-radius: 50%;
  font-size: 1.5em;

  > * {
    line-height: 1em;
  }
`

const Button = styled(({ loading, children, variant = '', className, ...props }) => {
  const wrappedChildren = !!loading ? (
    <Fragment>
      <IconLoading data-spin="true" />
      &nbsp;{loading}
    </Fragment>
  ) : (
    React.Children.map(children, child =>
      React.isValidElement(child) ? child : <span className="child">{child}</span>
    )
  )

  const _props = omit(props, ['loading', 'boxed', 'round', 'primary', 'tight', 'loose'])

  return !!props?.to ? (
    !!props?.navlink ? (
      <NavLink {..._props} className={`button ${className}`}>
        {wrappedChildren}
      </NavLink>
    ) : (
      <Link {..._props} className={`button ${className}`}>
        {wrappedChildren}
      </Link>
    )
  ) : (
    <button {..._props} className={`button ${variant} ${className}`}>
      {wrappedChildren}
    </button>
  )
})`
  border: none;
  padding: 1.3em 2em;
  margin: 0;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: rgb(${({ theme }) => theme?.dim});
  color: rgb(${({ theme }) => theme?.mid});
  border-radius: 0.8em;
  font-weight: bold;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;

  &.outlined {
    border: solid 1px;
    background: transparent;
    > * {
      background: var(--color-controlBackground);
    }
  }

  .child {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  > * {
    margin: 0 0.5rem;
    font-size: inherit;
    font: inherit;
    color: inherit;
  }

  &:hover {
    opacity: 0.8;
  }

  ${({ primary, theme }) =>
    !!primary &&
    css`
      background: rgb(${theme?.primary});
      color: rgb(${({ theme }) => theme?.background});
    `}

  ${({ small }) =>
    !!small &&
    css`
      padding: 1em 1.6em;
    `}

    &[disabled] {
    opacity: 0.4;
    filter: grayscale(100%);
    color: var(--color-mid);
    cursor: not-allowed;
  }
`

Button.Icon = IconButton

export default Button
