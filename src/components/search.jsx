import React from 'react'

const search = ({searchTerm, setsearchTerm}) => {
  return (
    <div className='search'>
     <div>
      <img src="./search.svg" alt="" />
      <input type="text" placeholder='Search through the thousand movies'
      value={searchTerm}
      onChange={(e) => setsearchTerm(e.target.value)}
      
      />
     </div>


    </div>
  )
}

export default search