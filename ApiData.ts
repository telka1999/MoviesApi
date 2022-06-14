export interface ApiData {
    averageRuntime: number
    dvdCountry: null
    ended: string
    externals:{
        imdb: string
        thetvdb: number
        tvrage: number
    }
    genres: string[]
    id: number
    image:{
        medium: string
        original: string
    }
    language: string
    name: string
    network:{
        country: {name: string, code: string, timezone: string}
        id: number
        name: string
    }
    officialSite: string
    premiered: string
    rating:{
        average: string
    }
    runtime: string
    schedule:{
        days: string[]
        length: number
        time: string
    }
    status: string
    summary: string
    type: string
    updated: number
    url: string
    webChannel: null
    weight: number
    _links:{
        previousepisode:{
            href: string
        }
        self:{
            href: string
        }
    }
    length:number
}