# WiseResponder

Backend service that combines Pinecone's vector database and Langchain's GPT augmentation to deliver highly educated and data-aware responses

## The main features I'm aiming for are:

* Data aware/web aware: WiseResponder dynamically sources relevant information from the web and its internal knowledge base, ensuring that generated responses are current, accurate, and contextually aware, providing a richer and more informative user experience.
* Document uploading: Can empowered by uploading custom documents, giving you the ability to query and extract information from them using the power of GPT-generated natural language responses. This feature makes WiseResponder uniquely tailored to your specific needs, providing targeted and meaningful insights.
* Session-based conversations: Holding engaging interactions with a session-based natural language conversations, maintaining context and coherence while being data aware. This enables a more fluid and authentic chat experience, fostering better understanding and more productive communication.


## You need

Node 18.15.0+
npm 9.5.0+

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
