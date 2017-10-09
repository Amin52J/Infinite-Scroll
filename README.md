# Infinite-Scroll

Apply infinite scroll to your website or web-app.

### How to start

* `npm install infinite-scroll-loading --save`
* import the normal or minified version from the dist directory.

### How to use

`InfiniteScroll(config)`

### Config

| Key            | Type                    | DefaultValue                  | DataAttribute | Required |
|----------------|-------------------------|-------------------------------|---------------|----------|
| container      | DOMElement              | `document.body`               | null          | false    |
| scrollTarget   | DOMElement              | `this.container`              | null          | false    |
| url            | String                  | null                          | data-url      | true     |
| request        | Object                  | `{data : "", method : "GET"}` | null          | false    |
| request.data   | Object or Function      | ""                            | null          | false    |
| request.method | String                  | "GET"                         | data-method   | false    |
| loading        | DOMString or DOMElement | `"<div class="infinite-scroll__loading"> Loading... </div>"` | null   | false    |
| moreButton     | DOMElement              | null                          | null          | false    |
| margin         | Number                  | 500                           | data-margin   | false    |
| onLoad         | Function                | null                          | null          | false    |

### Docs

* **container:** The target element that the infinite scroll should be applied to.
* **scrollTarget:** The element on which the scroll listener must be added to. If it is not specified the element will be the container.
* **url:** The url that the request must be sent to.
* **request.data:** The data to be sent via the request. It must be a single-level key-value Object or a Function returning an Object.
* **request.method:** The method of the request. By default it is `GET`.
* **loading:** The loading element. The loading element must have the class `infinite-scroll__loading`.
* **moreButton:** The button that loads the next set of data. If `moreButton` is specified, the scroll listener will be disabled.
* **margin:** The scroll margin on which the request of the next set of data must be sent. The value is in pixels from the bottom of the scrollTop.
* **onLoad:** A callback function to be called after the next set of data is acquired. It has the response as its parameter and the context of the function is the container element. By default if the onLoad method is not specified, it gets the response and appends it to the container.

##### Methods

  * **allDataLoaded:** A method to say that all the data is loaded and no requests must be sent anymore.

  **Usage:**

        infiniteScrollInstance.allDataLoaded(true) //to specify that all the data is loaded
        infiniteScrollInstance.allDataLoaded(false) //to specify that all the data is not loaded

  * **unbind:** A method to unbind the infinite scroll from the container.

  **Usage:**

        infiniteScrollInstance.unbind()

### Tricks

If you want to let the infinite scroll know that there are no more items to load and prevent it from sending requests again, you can set `x-last-page` header on your response from the server or return an empty string as the response.

### License
This project is licensed under the [MIT License](https://raw.githubusercontent.com/Amin52J/Infinite-Scroll/master/LICENSE).
