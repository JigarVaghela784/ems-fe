import React, { useEffect, useState } from 'react'
import UserCard from '../UserCard'
import NoData from 'src/components/NoData'
import CustomInfiniteScroll from '../../layouts/components/shared-components/CustomInfiniteScroll'
import Loader from 'src/components/Loader'

const EmployeesDetails = ({ allUsers, viewOnly, fetchData, pagination, noOfPages }) => {
  const [userData, setUserData] = useState([])

  useEffect(() => {
    setUserData(allUsers)
  }, [allUsers])

  const handleRemoveEmployee = id => {
    const updatedData = userData.filter(data => data.id !== id)
    setUserData(updatedData)
  }

  const handleSave = data => {
    const updatedUserData = userData.map(item => (item.id === data.id ? data : item))
    setUserData(updatedUserData)
  }

  return (
    <>
      <CustomInfiniteScroll
        dataLength={userData.length}
        loader={
          userData.length > 0 ? (
            <div className='pt-40 pb-40'>
              <Loader />
            </div>
          ) : null
        }
        hasMore={noOfPages !== pagination?.page}
        next={fetchData}
      >
        {userData.length > 0 ? (
          <div className='employee-table mt-20 pb-2'>
            {userData?.map(data => (
              <UserCard
                userData={data}
                key={data.id}
                handleRemoveEmployee={handleRemoveEmployee}
                handleSave={handleSave}
                viewOnly={viewOnly}
              />
            ))}
          </div>
        ) : (
          <div className='no-data-found'>
            <NoData />
          </div>
        )}
      </CustomInfiniteScroll>
    </>
  )
}

export default EmployeesDetails
