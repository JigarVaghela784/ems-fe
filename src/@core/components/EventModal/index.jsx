import React, { useEffect, useState } from 'react'
import CustomModal from '../../components/CustomModal'
import { useRouter } from 'next/router'
import Confetti from 'react-dom-confetti'
import { setCookie, getCookies } from 'cookies-next'
import { useUserStore } from '../../../store/user'
import WelcomePost from './WelcomePost'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import BirthdayCard from './BirthdayCard'
import AnniversaryPost from './AnniversaryPost'
import { getFormattedDate, setCookiesOptions } from '../../../../utils/helper'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isToday)
dayjs.extend(isBetween)

const EventModal = () => {
  const router = useRouter()
  const { events } = useUserStore()
  const [eventList, setEventList] = useState([])
  const [exploding, setExploding] = useState('')
  const [active, setActive] = useState('')
  const cookies = getCookies()

  useEffect(() => {
    const data = []
    events.forEach(val => {
      if (!cookies[val.id]) {
        data.push(val)
      }
    })
    setEventList(data)
  }, [events])

  useEffect(() => {
    setTimeout(() => {
      if (eventList.length > 0) {
        setActive(eventList[0].id)
      }
      setTimeout(() => {
        if (eventList.length > 0) {
          const currentDate = new Date()
          const expirationDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // Add one day in milliseconds
          setCookie('yourCookieName', 'yourCookieValue', {
            expires: expirationDate,
            path: '/',
            httpOnly: true
          })
          setExploding(eventList[0].id)
        }
      }, 500)
    }, 1000)
  }, [eventList])

  const config = {
    angle: '45',
    spread: '130',
    startVelocity: '200',
    elementCount: '100',
    dragFriction: '0.3',
    duration: '5000',
    stagger: '1',
    width: '12px',
    height: '8px',
    perspective: '1000px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
  }

  const handleCloseModal = () => {
    const activeIndex = events.findIndex(e => e.id === active)
    setActive('')
    setExploding('')
    const options = setCookiesOptions()
    const exp = dayjs().add(1, 'day').startOf('day')
    setCookie(active, 'true', { ...options, expires: new Date(exp) })

    setTimeout(() => {
      if (activeIndex + 1 !== events.length) {
        setActive(events[activeIndex + 1].id)
        setTimeout(() => {
          setExploding(events[activeIndex + 1].id)
        }, 500)
      }
    }, 100)
  }

  const renderCard = (event = {}) => {
    const commonDateFormat = 'MM-DD'
    const birthdayDate = getFormattedDate(event?.dob, commonDateFormat)
    const todayDate = getFormattedDate(undefined, commonDateFormat)
    const joiningDate = getFormattedDate(event?.joiningDate, commonDateFormat)

    const eventDate =
      getFormattedDate(event.startDate, commonDateFormat) === todayDate ||
      getFormattedDate(event.endDate, commonDateFormat) === todayDate ||
      dayjs(todayDate).isBetween(
        getFormattedDate(event?.startDate, commonDateFormat),
        getFormattedDate(event.endDate, commonDateFormat)
      )
    if (event?.isUser) {
      switch (true) {
        case dayjs(event?.joiningDate).isToday():
          return <WelcomePost event={event} />
        case birthdayDate === todayDate:
          return <BirthdayCard event={event} />
        case joiningDate === todayDate:
          return <AnniversaryPost event={event} />
        default:
          return <></>
      }
    }
  }

  return (
    <div>
      {eventList.map(event => {
        if (event.id !== active) return

        return (
          <div key={event.id}>
            <CustomModal open={true} handleClose={handleCloseModal} dialogClass='no-space-modal event-wrapper'>
              {renderCard(event)}
            </CustomModal>
            <div>
              <div className='confetti-wrapper' onClick={handleCloseModal}>
                <Confetti active={exploding} config={config} />
              </div>
              <div className='confetti-wrapper confetti-wrapper2' onClick={handleCloseModal}>
                <Confetti active={exploding} config={config} />
              </div>
              <div className='confetti-wrapper3' onClick={handleCloseModal}>
                <Confetti active={exploding} config={{ ...config, angle: '270', dragFriction: '0.5' }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default EventModal
