import { useEffect, useState, useRef, useCallback } from 'react'

import './App.css'
import { useBookSearch } from './Hooks/useBookSearch'
import axios from 'axios'

function App() {

  const [query, setquery] = useState('')
  const [pageNumber, setpageNumber] = useState(1)
  const { data, error, loading, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastElementRef = useCallback((node) => {
    if (loading) return
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entires) => {
      if (entires[0].isIntersecting) {
        setpageNumber((prePage) => prePage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const handelOnChane = ({ target: { value } }) => {
    setquery(value)
  }
  console.log(data);

  return (
    <>
      <input type="text" value={query} onChange={(e) => handelOnChane(e)} />

      {data && data.length > 0 && data.map((item, index) => {
        if (data.length === index + 1) {
          return (
            <div key={index} ref={lastElementRef}>{item.title}</div>
          )
        }
        else {
          return (<div key={index}> {item.title} </div>)
        }


      })}
      <br />
      {loading && query ? "Loading...." : null}



    </>
  )
}

export default App
