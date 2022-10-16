import tw from 'tailwind-styled-components';
import { EventCardDemo } from '../components/Event/eventCard';
import { EventDemoDescription } from '../layouts/Settings';
type ApiResponse = jh.response.maybe<jh.response.styles>

export class Styles {
    private readonly m_apiResponse : ApiResponse
    private readonly m_types = ["client","team","public","private"];
    private readonly m_groupedStyles? : jh.response.colors_v2[][];

    constructor (styles: ApiResponse)
    {
        
        this.m_apiResponse = styles;
        if (!this.m_apiResponse.success)
        {
            return;
        }

        const styleList = Object.values(this.m_apiResponse.response.colors);
        this.m_groupedStyles = this.m_types.map( (type) => styleList.filter(style => style.type === type) )
    }

    getGroupedStyles () : jh.response.maybeWithFallback<jh.response.colors_v2[][], string>
    {
        if (!this.m_apiResponse.success)
        {
            return {success: false, response: "loading client list..."};
        }

        return {success: true, response: this.m_groupedStyles as jh.response.colors_v2[][]}
    }

    getStylesTypes ()
    {
        return this.m_types;
    }

    renderListEvents()
    {

        /**
         * This check allow us to below safely force access of member: m_groupedStyles as it was initialized in the constructor
         */

        if (!this.m_apiResponse.success)
        {
            return <h1>{"Loading client list..."}</h1>;
        }

        return (
            <>
                    <div key={"settings-grid"} className='grid w-full' >
                {
                    this.m_groupedStyles!.map((collection,groupIndex) => {
                        return (
                            <div key={`root-${this.m_types[groupIndex]}-${groupIndex}-${Math.random()} `}>

                                <h1 className='mb-4 bg-slate-200 px-4 py-1 flex justify-center align-center font-bold'>
                                {
                                    this.m_types[groupIndex].toLocaleUpperCase()
                                }
                                </h1>
                                <div
                                className='grid grid-cols-5 gap-16 small_screen_w:gap-2 small_screen_w:grid-cols-2 mb-8'>
                                {
                                    collection
                                    .map((entry) => <EventDemoDescription name={entry.name} description={"Event job demo"}/>)
                                }
                                </div>

                            </div>
                        )
                    })
                }
                </div>
            </>
        )
    }

    renderList()
    {
        /**
         * This check allow us to below safely force access of member: m_groupedStyles as it was initialized in the constructor
         */

        if (!this.m_apiResponse.success)
        {
            return <option>{"Loading client list..."}</option>;
        }

        return (
            <>
                {
                    this.m_groupedStyles!.map((collection,index) => {
                        return (
                            <optgroup key={`optgroup-${this.m_types[index]}`} label={this.m_types[index]}>
                            {
                                collection.map(entry => {
                                    return (
                                        <option key={entry.name} value={entry.name}>
                                        {
                                            entry.name.charAt(0).toUpperCase() + entry.name.slice(1)
                                        }
                                        </option>
                                    )
                                })
                            }
                            </optgroup>
                        )
                    })
                }
            </>
        )
    }

    public static ClientOptionList = ({list}: {list: jh.response.maybe<jh.response.styles>}): JSX.Element =>
    {
        const myStyles = new Styles(list);
        return (myStyles.renderList());
    };
    
    public static ClientEventList = ({list}: {list: jh.response.maybe<jh.response.styles>}): JSX.Element =>
    {
        const myStyles = new Styles(list);
        return (myStyles.renderListEvents());
    };
}