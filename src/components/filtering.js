import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules, [
    (key, sourceValue, targetValue, source) => {
        if (key === 'totalFrom') {
            if (targetValue === '' || targetValue == null) {
                return {skip: true};
            }
            return {result: source.total >= Number(targetValue)};
        }

        if (key === 'totalTo') {
            if (targetValue === '' || targetValue == null) {
                return {skip: true};
            }
            return {result: source.total <= Number(targetValue)};
        }

        return {continue: true};
    }
]); 


export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
      .forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName])
                      .map(name => {
                            const option = document.createElement('option');
                            option.value = name;
                            option.textContent = name;
                            return option;
                      })
        )
     });
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action?.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.parentElement;
            const input = parent?.querySelector('input');
            if (input) {
                input.value = '';
            }
            if (field in state) {
                state[field] = '';
            }
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state)); 

    }
}