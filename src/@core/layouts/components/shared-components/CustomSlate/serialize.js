import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import { Text } from 'slate'

export const serialize = (children, isRequired) =>
  children?.map((node, i) => {
    if (Text?.isText(node)) {
      let text = (
        <span
          key={i}
          style={{
            whiteSpace: 'pre-wrap',
            color: node.color,
            background: node.background
          }}
          dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }}
        />
      )
      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.underline) {
        text = <u key={i}>{text}</u>
      }

      if (node.code) {
        text = <code key={i}>{text}</code>
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>
      }

      // Handle other leaf types here...
      return <Fragment key={i}>{text}</Fragment>
    } else if (node.type === 'link') {
      return (
        <a key={i} href={escapeHTML(node.url)} rel='noreferrer noopener' target='_blank'>
          {serialize(node.children)}
        </a>
      )
    } else {
      return renderText(node, i, isRequired)
    }

    if (!node) {
      return null
    }
  })

export const renderText = (node, index, isRequired) => {
  switch (node.rootType || node.type) {
    case 'heading-one':
      return <h1 key={index}>{serialize(node.children)}</h1>
    case 'heading-two':
      return <h2 key={index}>{serialize(node.children)}</h2>
    case 'heading-three':
      return <h3 key={index}>{serialize(node.children)}</h3>
    case 'numbered-list':
      return <ol key={index}>{serialize(node.children)}</ol>
    case 'bulleted-list':
      return (
        <ul key={index} className='bulleted-list-option'>
          {serialize(node.children)}
        </ul>
      )
    case 'link':
      return (
        <a key={index} href={escapeHTML(node?.value?.link)} target='_blank' rel='noreferrer noopener'>
          {node?.value?.link}
        </a>
      )
    case 'list-item':
      return <li key={index}> {serialize(node.children)}</li>
    case 'attribute-text':
      return <p key={index}>{serialize(node.value)}</p>
    default:
      return (
        <p key={index}>
          {serialize(node.children, isRequired)}
          {isRequired ? <span className='asterisk'>*</span> : null}
        </p>
      )
  }
}
