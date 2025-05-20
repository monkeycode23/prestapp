import { createSlice } from '@reduxjs/toolkit';



function getPaginationLimitLocalStorage(){
  try {

    const pags = {
      clients:15,
      loans:15,
      payments:15,
    }
    let pagination  = localStorage.getItem("pagination")
    
    if(!pagination){

      const obval = {
        "limit": "10",
        "page": 1,
        "search": "",
        "filter": ""
        }
    
      localStorage.setItem("pagination",JSON.stringify({
        clients:obval,
        loans:obval,
        payments:obval,
      }))

      
      return pags 
    }

    return JSON.parse(pagination)
    
  } catch (error) {
    console.error(error)
    return pags
  }
}


const limit = getPaginationLimitLocalStorage()

//console.log(limit)


const initialState = {
    label: '',
    page: 1,
    limit: limit,
    totalPages: 1,
    search: "",
    count: 0,
    totalResults: 0,
    filter: {},
}

const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        },  
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
      setTotalPages: (state, action) => {
        state.totalPages = action.payload;
      },
      setSearch: (state, action) => {
        state.search = action.payload;
      },
      setCount: (state, action) => {
        state.count = action.payload;
      },
      setTotalResults: (state, action) => {
        state.totalResults = action.payload;
      },
       
      setLabel: (state, action) => {
        state.label = action.payload;
      },
       
    },
})

export const {  setLabel, setPage, setLimit, setTotalPages, setSearch, setCount, setTotalResults, setFilter } = paginationSlice.actions;
export default paginationSlice.reducer;      


