import React, { useEffect, useState } from 'react'
import axios, { Axios } from 'axios'

export const useBookSearch = (query, pageNumber) => {

    const [data, setdata] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState(undefined);
    const [hasMore, sethasMore] = useState(false)

    const source = axios.CancelToken.source();

    useEffect(() => {
        setdata([])
    }, [query])

    useEffect(() => {
        // https://api.escuelajs.co/api/v1/products?offset=${pageN}&limit=5?title=""
        setLoading(true)
        seterror(undefined)
        axios.get(`https://openlibrary.org/search.json?q=${query}?page=${pageNumber}`,
            {
                cancelToken: source.token
            })

            .then((res) => {
                setLoading(false)
                seterror(undefined)
                setdata(res.data.docs)
                setdata((preData) => [...new Set([...preData, ...res.data.docs.map(b => b.title)])])
                sethasMore(res.data.docs.length > 0);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return
                seterror(err)
                console.log(err)
            })

        return () => source.cancel()
    }, [query, pageNumber])

    return { data, error, loading, hasMore }
}

