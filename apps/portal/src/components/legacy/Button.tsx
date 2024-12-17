import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { omit } from 'lodash'
import React, { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'

import IconLoading from '@/assets/icons/loader.svg?react'

/** @deprecated */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Button = styled(({ loading, children, variant = '', className, ...props }: any) => {
  const wrappedChildren = loading ? (
    <Fragment>
      <IconLoading data-spin="true" />
      &nbsp;{loading}
    </Fragment>
  ) : (
    React.Children.map(children, child =>
      React.isValidElement(child) ? child : <span className="child">{child}</span>
    )
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _props: any = omit(props, ['loading', 'boxed', 'round', 'primary', 'tight', 'loose', 'small'])

  return props?.to ? (
    props?.navlink ? (
      <NavLink {..._props} className={`button ${className ?? ''}`}>
        {wrappedChildren}
      </NavLink>
    ) : (
      <Link {..._props} className={`button ${className ?? ''}`}>
        {wrappedChildren}
      </Link>
    )
  ) : (
    <button {..._props} className={`button ${variant ?? ''} ${className ?? ''}`}>
      {wrappedChildren}
    </button>
  )
})`
  border: none;
  padding: 1.156rem 1.6rem;
  margin: 0;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: rgb(${({ theme }) => theme?.dim});
  color: rgb(${({ theme }) => theme?.mid});
  border-radius: 1rem;
  transition: all 0.15s ease-in-out;
  white-space: nowrap;

  &.outlined {
    color: var(--color-text);
    border: 1px solid var(--color-text);
    background: transparent;
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
      color: rgb(${theme?.background});
      border: 3.13px solid rgb(${theme.primary});
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
