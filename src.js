const utils = {
    SPINNER: `<div class="spinner-border text-warning" role="status"></div>`,
    numberToReadable: function (number) {
        /*
        Returns a human-readable string of a given number
        */
        let formated_number = NaN
        if (number !== "") {
            try {
                if (typeof (number) != "number") number = parseFloat(number)
                formated_number = (Math.round((number + Number.EPSILON) * 1000) / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            catch (e) {
                console.log("Failed to format number.");
            }
        }
        else {
            formated_number = ""
        }
        return formated_number
    },

    compareObjects: function (obj1, obj2) {
        /*
          Compares 2 objects for equality
          From: https://gist.github.com/nicbell/6081098"
        */

        //Loop through properties in object 1
        for (var p in obj1) {
            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    if (!sessioner.compare(obj1[p], obj2[p])) return false;
                    break;
                //Compare function code
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                    break;
                //Compare values
                default:
                    if (obj1[p] != obj2[p]) return false;
            }
        }

        //Check object 2 for any extra properties
        for (var p in obj2) {
            if (typeof (obj2[p]) == 'undefined') return false;
        }
        return true;
    },

    formToJSON: function (form_name) {
        /*
          Returns a JS object built from a form frm_name using name attributes
        */
        const text_types = ["color", "date", "datetime-local", "email", "hidden", "month", "password", "tel", "time", "url", "week", "text"]
        let formData = new FormData(document.querySelector(`[name=${form_name}]`))
        let jsonData = {}
        formData.forEach((value, key) => {
            input_type = document.querySelector(`[name=${form_name}]`).querySelector(`[name='${key}']`).type
            if (text_types.indexOf("text") != -1) { jsonData[key] = value == '' ? null : value }
            else if (value == 'on') value = true
            else {
                if (value.indexOf(".")) value = parseFloat(value)
                else { value = parseInt(value) }
            }
        })
        return jsonData
    },

    JSONToForm: function (from_name, data) {
        let currentElement;
        Object.keys(data).forEach(k => {
            currentElement = document.querySelector(`[name='${from_name}']`).querySelector(`[name='${k}']`);
            if (currentElement.type == 'radio') {
                if (currentElement.id == data[k]) {
                    currentElement.checked = true;
                }
            } else if (currentElement.type == 'checkbox') {
                if (currentElement.name == data[k]) {
                    currentElement.checked = true;
                }
            } else {
                currentElement.value = data[k]
            }
        })
    },

    btnLoad: async function (selector, _promise) {
        let button
        let temp_html
        try {
            button = document.querySelector(selector)
            temp_html = button.innerHTML
            button.innerHTML = this.SPINNER

            button.disabled = true

            await _promise.then(r => {
                button.disabled = false
                button.innerHTML = temp_html
            })
        }
        catch (e) {
            button.disabled = false
            button.innerHTML = temp_html
            console.log("BTN-LOAD Error", e)
        }
    },

    loadJS: function (url, implementationCode = function () { }, location) {
        // From https://stackoverflow.com/a/31374433/5253580
        /* url is URL of external file, implementationCode is the code
            to be called from the file, location is the location to 
            insert the <script> element.
               e.g: loadJS('yourcode.js', yourCodeToBeCalled, document.body);
        */

        var scriptTag = document.createElement('script');
        scriptTag.src = url;

        scriptTag.onload = implementationCode;
        scriptTag.onreadystatechange = implementationCode;

        location.appendChild(scriptTag);
    }

}
