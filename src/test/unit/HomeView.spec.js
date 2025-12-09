import { flushPromises, mount } from '@vue/test-utils'
import { describe,expect,test } from 'vitest'
import Home from '@/views/HomeView.vue';

describe("La vista de HomeView.vue" , () =>{
    // Test Integración
    test("La carga de los card de cada pokemon", async ()=>{
    const mockData ={
        results: [
            { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            {id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' }
        ]
    }

        global.fetch=vi.fn().mockResolvedValue({
            json:() => Promise.resolve(mockData)
        })

        const wrapper  = mount(Home);
        await flushPromises()
        const card = wrapper.findAll('pokemon-box-component')
        expect(card).toHaveLength(2)
        expect(card[0].props('name')).toBe('bulbasaur')
        expect(card[1].props('name')).toBe('ivysaur')
    });

    // Test Integración
    test("Muestre el mensaje de Error de la carga", async ()=>{
        global.fetch = vi.fn().mockRejectedValue(new Error("Error API fallida"))
        const wrapper= mount(Home)
        await flushPromises()
        expect(wrapper.find(".error-state").exist()).toBe(true)
        expect(wrapper.find(".error-state").text()).toContain("Error de Carga")
    });

    // Test Integración
    test("Muestra indicador de carga mientras fetch está activo", async ()=>{
        let resultF
        global.fetch = vi.fn(() => new Promise(res => resultF = res))
        const wrapper= mount(Home)
        expect(wrapper.find(".loading-state").exist()).toBe(true)

        resultF({json :() => Promise.resolve({results: []})})
        await flushPromises()
        expect(wrapper.find(".loading-state").exist()).toBe(false)

    });

    // Test Unitario
    test("La carga del imagen de cada card pokemon", async ()=>{
        global.fetch=vi.fn().mockResolvedValue({
            json:() => Promise.resolve(mockData)
        })

        const wrapper  = mount(Home);
        await flushPromises()
        const card = wrapper.findAll('pokemon-box-component')
        expect(card[0].props('img')).toBeDefined()
        expect(card[1].props('img')).toBeDefined()
    });

    // Test Unitario
    test("Cada card recibe correctamente las props name, number y to", async () => {
        const mockData ={
            results: [
                { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            ]
        }
        global.fetch=vi.fn().mockResolvedValue({
            json:() => Promise.resolve(mockData)
        })

        const wrapper  = mount(Home);
        await flushPromises()
        const card = wrapper.findAll('pokemon-box-component')
        expect(card.props('number')).toBe('1')
        expect(card.props('name')).toBe("bulbasaur")
        expect(card.props('to')).toBe("pokemon/1/")
        expect(card.props('img')).toBeDefined()
        
    });

    // Test Unitario
    test("Renderiza tantas cards como items tiene pokemonList", async () => {
        const mockData ={
            results: [
                { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
                {id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
                {id: 3, name: 'Venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' }
            ]
        }
        global.fetch=vi.fn().mockResolvedValue({
            json:() => Promise.resolve(mockData)
        })

        const wrapper  = mount(Home);
        await flushPromises()
        const cards = wrapper.findAll('pokemon-box-component')
        expect(cards).toHaveLength(mockData.results.length)
    });

    // Test Unitario 
    test("La función extractIdFromUrl devuelve el ID correcto", () => {
        const url = 'https://pokeapi.co/api/v2/pokemon/25/'
        const { extractIdFromUrl } = require('@/views/HomeView.vue')
        const id = extractIdFromUrl(url)
        expect(id).toBe('25')
    });

    // Test Integración
    test("Hace fetch a la URL correcta de la API", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ json: () => Promise.resolve({ results: [] }) })
            global.fetch = fetchMock

            mount(Home)
            await flushPromises()

            expect(fetchMock).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=151'
            )
    });
});