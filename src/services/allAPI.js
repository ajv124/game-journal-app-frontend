import apiService from "@/api/apiService";

export const registerAPI=async(userData)=>{
    return apiService("POST","/register",userData)
}

export const loginAPI=async(userData)=>{
    return apiService("POST","/login",userData)
}

export const logoutAPI=async()=>{
    return apiService("POST","/logout")
}

export const getUserAPI=async()=>{
    return apiService("GET","/me")
}

export const getAllGamesAPI=async(params)=>{
    return apiService("GET",`/games?${params}`)
}

export const getGenresAPI=async()=>{
    return apiService("GET",'/genres')
}

export const getPlatformsAPI=async()=>{
    return apiService("GET",'/platforms')
}

export const getScreenshotsAPI=async(id)=>{
    return apiService("GET",`/screenshots/${id}`)
}

export const getSingleGameAPI=async(id)=>{
    return apiService("GET",`/get-game/${id}`)
}

export const saveGameAPI=async(id,gameData)=>{
    return apiService("POST",`/save-game/${id}`,gameData)
}

export const getSavedGamesAPI=async()=>{
    return apiService("GET","/saved-games")
}

export const removeGameAPI=async(id)=>{
    return apiService("DELETE",`/remove-game/${id}`)
}

export const createTimelineAPI=async(id,name)=>{
    return apiService("POST",`/create-timeline/${id}`,{name})
}

export const getTimelineGameAPI=async(id)=>{
    return apiService("GET",`/timeline-game/${id}`)
}

export const changeStatusAPI=async(id,status)=>{
    return apiService("PUT",`/status/${id}`,{status})
}

export const getTimelinesAPI=async(id)=>{
    return apiService("GET",`/timelines/${id}`)
}

export const getAllEntriesAPI=async(id)=>{
    return apiService("GET",`/entries/${id}`)
}

export const createEntryAPI=async(id,entryData)=>{
    return apiService("POST",`/create-entry/${id}`,entryData)
}