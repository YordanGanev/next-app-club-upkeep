import { useState, useEffect, useRef } from "react";
import { queryPushDate } from "./common";


export const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        console.log(windowSize);

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export const useForm = (initObj) => {
    // console.warn(initObj);
    const [state, setState] = useState(initObj);

    const handleChange = (e, valueType) => {
        if (valueType) {
            // console.log(valueType);

            setState((state) => ({...state, [valueType.name]: valueType.value }));

            //console.log(state);
            return;
        }

        // Multiform clears last session
        if (e === null) {
            setState({});
            return;
        }

        e.persist();
        //console.log(e.target.value);
        setState((state) => ({...state, [e.target.name]: e.target.value }));
        console.log(state);
    };

    return [state, handleChange];
};


export const useOutsideClick = (callback) => {
    const ref = useRef();

    useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();                
                // console.info('Popup Hook Callback');
            } else {
                // console.info("Missed", event, "Target", ref);
            }
        };

        document.addEventListener("click", handleClick, true);
        // console.info('Popup Hook added');

        return () => {
            // console.info('Popup Hook remove')
            document.removeEventListener("click", handleClick, true);
        };
    }, [ref]);

    return ref;
};

export const queryDateHook = (router) => {

    const { day, month, year } = router.query;

    let date = new Date(year, month, day);

    if (isNaN(date.getTime())) date = new Date(); //todays date

    useEffect(() => {
        if (day && month && year) return;

        queryPushDate(router, date.getFullYear(), date.getMonth(), date.getDate());
    }, []);

    return date;
}