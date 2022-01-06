const StorageCtrl = (function() {
    return {
        storeItem: function(item) {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getitem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if (localStorage.getitem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
})();

const ItemCtrl = (function() {
  
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: [
           // {id: 0, name: "Steak Dinner", calories: 1200},
            // {id: 1, name: "Cookie", calories: 400},
            // {id: 2, name: "Eggs", calories: 300},
        ],
        total: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            calories = parseInt(calories);
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(function(item) {
                total = total + item.calories;
                console.log(total);
            });
            data.total = total;
            console.log(data.total);
            return data.total;
        },
        logData: function() {
            return data;
        }
    }
})();
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput:'#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn',
        totalCalories: '.total-calories'
    }
    return {
        populateItemList: function(items) {
           
            let html = '';

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return{
                name:document.querySelector(UISelectors.itemNameInput).value, 
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            const li =document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: <strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        }
    }
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();
        document.querySelector(UISelectors.addBtn);
            addEventListener('click', itemAddSubmit);
            document.addEventListener('DOMContentLoaded', getItemsFromStorage);
    }
    const itemAddSubmit = function(event) {
        console.log('item add event function');
        const input = UICtrl.getItemInput();
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            StorageCtrl.storeItem(newItem);
            UICtrl.clearInput();
        }
        event.preventDefault();
    }
    const getItemsFromStorage = function() {
        const items = StorageCtrl.getItemsFromStorage();
        UICtrl.populateItemList(items);
    }
    return {
        init: function() {
            console.log("Initializing App");
         
            const items = ItemCtrl.getItems();
         
            UICtrl.populateItemList(items);
            
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl,  UICtrl);

App.init();