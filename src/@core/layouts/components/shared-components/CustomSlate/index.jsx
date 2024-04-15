import React, { useCallback, useMemo, useRef } from 'react'
import isHotkey from 'is-hotkey'
import imageExtensions from 'image-extensions'
import { Editable, withReact, useSlate, Slate, useSlateStatic, ReactEditor, useSelected, useFocused } from 'slate-react'
import { Editor, Transforms, createEditor, Element as SlateElement } from 'slate'
import { withHistory } from 'slate-history'
import { css } from '@emotion/css'

//import { Button, Icon, Toolbar } from '../components'
import Image from 'mdi-material-ui/Image'
import FormatBold from 'mdi-material-ui/FormatBold'
import FormatItalic from 'mdi-material-ui/FormatItalic'
import FormatUnderline from 'mdi-material-ui/FormatUnderline'
import CodeTags from 'mdi-material-ui/CodeTags'
import Numeric1Box from 'mdi-material-ui/Numeric1Box'
import Numeric2Box from 'mdi-material-ui/Numeric2Box'
import FormatQuoteClose from 'mdi-material-ui/FormatQuoteClose'
import FormatListNumbered from 'mdi-material-ui/FormatListNumbered'
import FormatListBulleted from 'mdi-material-ui/FormatListBulleted'
import FormatAlignRight from 'mdi-material-ui/FormatAlignRight'
import FormatAlignCenter from 'mdi-material-ui/FormatAlignCenter'
import FormatAlignLeft from 'mdi-material-ui/FormatAlignLeft'
import FormatAlignJustify from 'mdi-material-ui/FormatAlignJustify'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import Toolbar from '@mui/material/Toolbar'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code'
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const CustomSlate = ({ ...res }) => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <>
      <div className='slate-main'>
        <Slate editor={editor} {...res}>
          {' '}
          <Toolbar>
            <div className='btn-Slate'>
              <MarkButton format='bold' icon={<FormatBold />} />
              <MarkButton format='italic' icon={<FormatItalic />} />
              <MarkButton format='underline' icon={<FormatUnderline />} />
              <MarkButton format='code' icon={<CodeTags />} />
              <BlockButton format='heading-one' icon={<Numeric1Box />} />
              <BlockButton format='heading-two' icon={<Numeric2Box />} />
              <BlockButton format='block-quote' icon={<FormatQuoteClose />} />
              <BlockButton format='numbered-list' icon={<FormatListNumbered />} />
              <BlockButton format='bulleted-list' icon={<FormatListBulleted />} />
              <BlockButton format='left' icon={<FormatAlignLeft />} />
              <BlockButton format='center' icon={<FormatAlignCenter />} />
              <BlockButton format='right' icon={<FormatAlignRight />} />
              <BlockButton format='justify' icon={<FormatAlignJustify />} />
              {/* <InsertImageButton icon={<Image />} /> */}
            </div>
          </Toolbar>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder='Enter some text…'
            className='slate-editor'
            spellCheck
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  toggleMark(editor, mark)
                }
              }
            }}
          />
        </Slate>
      </div>
    </>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true
  })
  let newProperties
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format
    }
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor

  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)

  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')

  return (
    <Button
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      style={{ color: isActive ? 'black' : '' }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  const isActive = isMarkActive(editor, format)

  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      style={{ color: isActive ? 'black' : '' }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

// const withImages = editor => {
//   const { insertData, isVoid } = editor

//   editor.isVoid = element => {
//     return element.type === 'image' ? true : isVoid(element)
//   }

//   editor.insertData = data => {
//     const text = data.getData('text/plain')
//     const { files } = data

//     if (files && files.length > 0) {
//       for (const file of files) {
//         const reader = new FileReader()
//         const [mime] = file.type.split('/')

//         if (mime === 'image') {
//           reader.addEventListener('load', () => {
//             const url = reader.result
//             insertImage(editor, url)
//           })

//           reader.readAsDataURL(file)
//         }
//       }
//     } else if (isImageUrl(text)) {
//       insertImage(editor, text)
//     } else {
//       insertData(data)
//     }
//   }

//   return editor
// }

// const insertImage = (editor, url) => {
//   const text = { text: '' }
//   const image = { type: 'image', url, children: [text] }
//   Transforms.insertNodes(editor, image)
// }

// const Element = props => {
//   const { attributes, children, element } = props

//   switch (element.type) {
//     case 'image':
//       return <Image {...props} />
//     default:
//       return <p {...attributes}>{children}</p>
//   }
// }

// const Image = ({ attributes, children, element }) => {
//   const editor = useSlateStatic()
//   const path = ReactEditor.findPath(editor, element)

//   const selected = useSelected()
//   const focused = useFocused()
//   return (
//     <div {...attributes}>
//       {children}
//       <div
//         contentEditable={false}
//         className={css`
//           position: relative;
//         `}
//       >
//         <img
//           src={element.url}
//           className={css`
//             display: block;
//             max-width: 100%;
//             max-height: 20em;
//             box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
//           `}
//         />
//         <Button
//           active
//           onClick={() => Transforms.removeNodes(editor, { at: path })}
//           className={css`
//             display: ${selected && focused ? 'inline' : 'none'};
//             position: absolute;
//             top: 0.5em;
//             left: 0.5em;
//             background-color: white;
//           `}
//         >
//           <Icon>delete</Icon>
//         </Button>
//       </div>
//     </div>
//   )
// }

// const InsertImageButton = () => {
//   const editor = useSlateStatic()
//   const fileInputRef = useRef(null)

//   const handleFileInputChange = async e => {
//     const files = e.target.files

//     if (files.length > 0) {
//       const file = files[0]

//       if (file && isImageFile(file)) {
//         const url = await readFileAsDataURL(file)
//         insertImage(editor, url)
//       } else {
//         alert('Invalid file. Please select an image file.')
//       }
//     }
//   }

//   const handleClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click()
//     }
//   }

//   const isImageFile = file => {
//     const extension = file.name.split('.').pop().toLowerCase()
//     return imageExtensions.includes(extension)
//   }

//   const readFileAsDataURL = file => {
//     return new Promise(resolve => {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         resolve(reader.result)
//       }
//       reader.readAsDataURL(file)
//     })
//   }

//   return (
//     <>
//       <input
//         type='file'
//         accept='image/*'
//         ref={fileInputRef}
//         style={{ display: 'none' }}
//         onChange={handleFileInputChange}
//       />
//       <Button onClick={handleClick}>
//         <Icon>image</Icon>
//       </Button>
//     </>
//   )
// }

// const isImageUrl = url => {
//   if (!url) return false
//   if (!isUrl(url)) return false
//   const ext = new URL(url).pathname.split('.').pop()
//   return imageExtensions.includes(ext)
// }

// const initialValue = [
//   {
//     type: 'paragraph',
//     children: [
//       { text: 'This is editable ' },
//       { text: 'rich', bold: true },
//       { text: ' text, ' },
//       { text: 'much', italic: true },
//       { text: ' better than a ' },
//       { text: '<textarea>', code: true },
//       { text: '!' }
//     ]
//   },
//   {
//     type: 'paragraph',
//     children: [
//       {
//         text: "Since it's rich text, you can do things like turn a selection of text "
//       },
//       { text: 'bold', bold: true },
//       {
//         text: ', or add a semantically rendered block quote in the middle of the page, like this:'
//       }
//     ]
//   },
//   {
//     type: 'block-quote',
//     children: [{ text: 'A wise quote.' }]
//   },
//   {
//     type: 'paragraph',
//     align: 'center',
//     children: [{ text: 'Try it out for yourself!' }]
//   }
// ]

export default CustomSlate
