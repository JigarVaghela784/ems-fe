import UploadOutlined from 'mdi-material-ui/Upload'
import cs from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { canvasPreview } from './canvasPreview'
import CustomButton from '../../@core/layouts/components/shared-components/CustomButton'
import Input from '@mui/material/Input'
import RemoveWarningModal from '../../@core/layouts/components/shared-components/RemoveWarningModal'
import CustomModal from '../../@core/layouts/components/shared-components/CustomModal'
import CustomInput from '../CustomInput'
import Avatar from '@mui/material/Avatar'
import { v4 as uuidv4 } from 'uuid'
import { dataURLtoFile } from '../../../utils/helper'

const AvatarUploadModal = React.memo(
  ({
    imagePath,
    setIsVisible,
    isVisible,
    borderRadius = 200 / (100 / 50),
    isImageCrop,
    title = 'Upload image',
    aspect = 16 / 9,
    handleSave,
    isFavicon,
    isLargeUpload
  }) => {
    const [file, setFile] = useState(imagePath)
    const [position, setPosition] = useState({ x: 0.5, y: 0.5 })
    const [scale, setScale] = useState(1)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [completedCrop, setCompletedCrop] = useState()
    const previewCanvasRef = useRef(null)
    const inputRef = useRef()
    const imgRef = useRef(null)
    const [rotate, setRotate] = useState(0)
    const [uploading, setUploading] = React.useState(false)
    const [confirmModal, setConfirm] = React.useState(false)
    const editorRef = useRef()
    const [unableUpload, setUnableUpload] = useState(false)
    const [imageUploaded, setImageUploaded] = useState(false)
    const [isZoom, setIsZoom] = useState(false)

    useEffect(() => {
      if (isVisible) {
        setIsZoom(false)
        setTimeout(() => {
          document.getElementById('getFile').click()
        }, 200)
      }
    }, [isVisible])

    const setImageCropFile = file => {
      setCrop(undefined)
      const reader = new FileReader()
      if (!reader) return
      reader.addEventListener('load', () => setFile(reader.result.toString() || ''))
      reader.readAsDataURL(file)
    }

    const handleNewImage = e => {
      setUnableUpload(true)
      setIsZoom(true)
      if (!e.target.files[0]) return
      if (!isImageCrop) return setFile(e.target.files[0])
      setImageUploaded(true)
      setImageCropFile(e.target.files[0])
    }

    const onRemove = () => {
      setFile('')
      setIsVisible(false)
      handleSaveUploadImg()
    }

    useEffect(() => {
      if (imagePath && imagePath !== '/images/nopic') {
        setFile(imagePath)
      } else {
        if (inputRef.current) {
          inputRef.current.value = ''
          inputRef?.current?.input?.click()
        }
        setFile(null)
      }
    }, [imagePath, isVisible])

    const saveImgUrl = async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        // We use canvasPreview as it's much faster than imgPreview.
        const cropImg = await canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate,
          isFavicon,
          isLargeUpload
        )

        const imageObj = dataURLtoFile(cropImg, `${uuidv4()}.png`)

        const formData = new FormData()
        formData.append('file', imageObj)

        return imageObj
      }
    }

    const handleSaveUploadImg = val => {
      if (handleSave) handleSave(val?.public_url || '')
    }

    const handleScale = e => {
      if (e.target.value === '0') return
      const scale = parseFloat(e.target.value)
      setScale(scale)
    }

    const handlePositionChange = position => {
      setPosition(position)
    }

    const rotateScale = e => {
      const scale = parseFloat(e.target.value)
      e.preventDefault()
      setRotate(scale * 3.6)
    }

    const logCallback = e => {
      console.log('callback', e)
    }

    function centerAspectCrop(mediaWidth, mediaHeight) {
      return centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90
          },
          aspect,
          mediaWidth,
          mediaHeight
        ),
        mediaWidth,
        mediaHeight
      )
    }

    function onImageLoad(e) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height))
    }

    const onCancelHandle = () => {
      setIsVisible(false)
    }

    return (
      <>
        <CustomModal
          className='avatar-upload-modal'
          modalPortalClassName='avatar-upload'
          open={isVisible}
          title={title}
          handleClose={onCancelHandle}
          width={550}
          style={{ top: '40px' }}
        >
          <Dropzone
            onDrop={acceptedFiles => {
              if (!isImageCrop) return setFile(acceptedFiles[0])
              setImageCropFile(acceptedFiles[0])
              setUnableUpload(true)
              setImageUploaded(true)
            }}
            noClick
            multiple={false}
            style={{
              width: 200,
              height: 200,
              marginBottom: '35px'
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className='white-space_pre-wrap'>
                <div className='d-flex justify-center'>
                  {isImageCrop ? (
                    <>
                      {file && !file.includes('data:text/html') ? (
                        <>
                          <ReactCrop
                            maxHeight={250}
                            className='reactCropWrapper'
                            aspect={aspect === 1 ? aspect : null}
                            crop={isVisible ? crop : null}
                            circularCrop={!borderRadius === 0}
                            keepSelection
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={c => setCompletedCrop(c)}
                            disabled={uploading || !imageUploaded}
                          >
                            <img
                              width={1600}
                              height={1600}
                              ref={imgRef}
                              alt='Crop me'
                              src={file}
                              style={{
                                transform: `scale(${scale}) rotate(${rotate}deg)`
                              }}
                              onLoad={onImageLoad}
                            />
                          </ReactCrop>
                        </>
                      ) : (
                        <div className='bio-section__avatar-wrapper border'>
                          <Avatar
                            avatar={<UploadOutlined style={{ color: '#979797', fontSize: 150 }} fontSize={150} />}
                            style={{
                              cursor: 'pointer',
                              border: '1px solid #979797',
                              width: 150,
                              height: 150
                            }}
                            onClick={() => {
                              document.getElementById('getFile').click()
                            }}
                          />
                        </div>
                      )}
                      {/*selected img canvas*/}
                      <div className='d-none'>
                        {Boolean(completedCrop) && (
                          <canvas
                            ref={previewCanvasRef}
                            style={{
                              border: '1px solid black',
                              objectFit: 'contain',
                              width: completedCrop.width,
                              height: completedCrop.height
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <AvatarEditor
                      crossOrigin='anonymous'
                      ref={editorRef}
                      scale={parseFloat(scale)}
                      width={200}
                      height={200}
                      position={position}
                      onPositionChange={handlePositionChange}
                      rotate={parseFloat(rotate)}
                      borderRadius={borderRadius}
                      onLoadFailure={logCallback.bind(this, 'onLoadFailed')}
                      onLoadSuccess={logCallback.bind(this, 'onLoadSuccess')}
                      onImageReady={logCallback.bind(this, 'onImageReady')}
                      image={file}
                      className='editor-canvas'
                    />
                  )}
                </div>
                <br />
                {!uploading && (
                  <div className='d-flex  w-full justify-center'>
                    <CustomButton
                      onClick={() => {
                        document.getElementById('getFile').click()
                      }}
                      fullWidth={false}
                      size='small'
                    >
                      {file ? 'Change image' : 'Add'}
                    </CustomButton>
                    {file && (
                      <CustomButton
                        disabled={!file}
                        className='ml-10'
                        onClick={() => {
                          setConfirm(true)
                        }}
                        fullWidth={false}
                        variant='outlined'
                        size='small'
                      >
                        Remove image
                      </CustomButton>
                    )}
                  </div>
                )}

                <Input
                  style={{ display: 'none' }}
                  id='getFile'
                  name='newImage'
                  ref={inputRef}
                  type='file'
                  accept='.png, .jpg, .jpeg'
                  onChange={handleNewImage}
                  className={cs({
                    ['newImageInput']: !inputRef?.current?.input?.value
                  })}
                />
              </div>
            )}
          </Dropzone>
          {isZoom && (
            <div className='d-flex justify-between px-20'>
              <div className='d-flex align-center range-input mb-8'>
                Zoom:{'  '}
                <CustomInput
                  name='scale'
                  type='range'
                  onChange={handleScale}
                  min='1'
                  max='2'
                  step='0.01'
                  defaultValue='1'
                  InputProps={{
                    inputProps: {
                      max: 5,
                      min: 1
                    }
                  }}
                />
              </div>
              <div className='d-flex align-center range-input mb-8'>
                Rotate:{'  '}
                <CustomInput
                  name='scale'
                  type='range'
                  onChange={rotateScale}
                  min='0'
                  max='180'
                  step='1'
                  defaultValue='0'
                />
              </div>
            </div>
          )}
          <div className='modal-footer-upload-image'>
            <CustomButton
              className='btn-secondary mr-5'
              key='cancel'
              onClick={() => {
                setIsVisible(false)
                setFile('')
              }}
              variant='outlined'
              fullWidth={false}
              size='small'
            >
              Cancel
            </CustomButton>
            <CustomButton
              key='save'
              type='primary'
              disabled={uploading || !unableUpload || imageUploaded === false || crop?.width === 0}
              htmlType='submit'
              loading={uploading}
              size='small'
              onClick={async () => {
                if (handleSave) {
                  let image
                  if (isImageCrop) {
                    try {
                      setUploading(true)
                      image = await saveImgUrl()
                      setUploading(false)
                      setUnableUpload(false)
                    } catch (e) {
                      setUploading(false)
                    }
                  } else {
                    image = editorRef?.current?.getImageScaledToCanvas().toDataURL()
                  }
                  const blob = new Blob([image])
                  const url = URL.createObjectURL(blob)
                  handleSave(url, image)
                }
              }}
              fullWidth={false}
            >
              Upload
            </CustomButton>
          </div>
        </CustomModal>
        {confirmModal && (
          <RemoveWarningModal
            message='Are you sure want to remove this file?'
            onClose={() => {
              setConfirm(false)
            }}
            onConfirm={() => {
              onRemove()
              setUnableUpload(false)
              setImageUploaded(true)
              setConfirm(false)
            }}
          />
        )}
      </>
    )
  }
)
AvatarUploadModal.displayName = 'AvatarUploadModal'

export default AvatarUploadModal
