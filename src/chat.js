import { ApiAiClient } from '../src/api-ai-javascript/es6/ApiAiClient';
import {applyMiddleware,createStore} from 'redux';

const accessToken = '20539d4bfb0f43d484ca0499de841286';
const client = new ApiAiClient({ accessToken });
const ON_MESSAGE = 'ON_MESSAGE';

const initialState = [{
    text:'Greetings, How can i help you?',
    sender:'bot'
}]

export const sendMessage = (text, sender = 'user')=>({
    type: ON_MESSAGE,
    payload: { text, sender }
})

const messageMiddleware = () => next => action => {
    next(action);
    if (action.type === ON_MESSAGE) {
        const { text } = action.payload;
        client.textRequest(text)
            .then(onSuccess)

        function onSuccess(response) {
            console.log('what we got', response);
            const { result: {resolvedQuery}} = response;
            const { result: { fulfillment } } = response;
            console.log('bot returned', fulfillment.messages[0].speech);
            var message = fulfillment.messages;
            console.log('message', message);
            // var item = [];
            if (message[0].speech === 'map') {
                console.log('it is a map');
                var mapList = [];
                mapList.push(Number(message[1].speech));
                mapList.push(Number(message[2].speech));
                next(sendMessage(mapList,'map'));
            }else if(message[0].speech === 'video'){
                next(sendMessage(message[1].speech,'video'));
            }else if(message[0].speech ==='_book'){
                next(sendMessage(message[0].speech,'book'));
            }else if(message[0].speech==='_seat'){
                next(sendMessage(resolvedQuery,'_seat'));
            } 
            else {
                console.log('aaaa');
                for (let i = 0; i < message.length; i++) {
                    console.log('Each', message[i].speech);
                    // item.push(message[i].speech);
                    next(sendMessage(message[i].speech, 'bot'));
                }
            }
            // next(sendMessage(item,'bot'));
        }
    }
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ON_MESSAGE':
            return [...state, action.payload];
        default:
            return state;
    }
}
export const store = createStore(messageReducer,applyMiddleware(messageMiddleware));