angular.module('toDo', ['ngDraggable', 'ngMaterial'])
    .controller('toDoCtrl', todoCtrl)
    .service('operationService', operationService)
    .directive('itemTodo', itemTodo);

function todoCtrl($scope, $http, operationService) {
    operationService.get()
        .then(function (res) {
            console.log(res.data.todos);
            $scope.todoList = res.data.todos;
        }, function (data) {
            console.log('Error: ' + data);
        });

    //add new task
    $scope.addTodo = function () {
        if ($scope.newTodo) {
            $scope.todoList.push({"value": $scope.newTodo});
            operationService.post({ "todo": {"value": $scope.newTodo, "done": false}})
                .then(function (data) {
                    $scope.newTodo = '';
                }, function (data) {
                    console.log('Error: ' + data);
                });
        } else {
            alert('You don\'t enter task');
        }
    };

    //delete task
    $scope.removeTodo = function (index) {
        console.log(index, $scope.todoList[index]);
        operationService.delete($scope.todoList[index]._id, {"_id": $scope.todoList[index]._id})
            .then(function () {
                console.log(1);
                $scope.todoList.splice(index, 1);
            }, function (data) {
                console.log('Error: ' + data);
            });
    };

    //edit task
    $scope.editTask = function (index) {
        $scope.popup = true;
        $scope.editTodo = $scope.todoList[index].value;
        $scope.saveEdit = function () {
            $scope.todoList[index].value = $scope.editTodo;
            $scope.popup = false;
            operationService.put($scope.todoList[index]._id, {"todo": $scope.todoList[index]})
                .then(function() {
                    console.log('Todo updated');
                }, function (data) {
                    console.log('Error: ' + data);
                });
        };
        $scope.cancelEdit = function () {
            $scope.popup = false;
        };
    };

    //done task
    $scope.doneTask = function (index) {
        console.log($scope.todoList[index].done);
        operationService.put($scope.todoList[index]._id, {"todo": $scope.todoList[index]})
            .then(function() {
                console.log('you done todo');
            }, function (data) {
                console.log(data);
                console.log('Error: ' + data);
            });
    };

    $scope.onDropComplete = (data, index, data2, event) => {
        console.log('onDropComplete', data, index, data2, event);
        for (var i = 0; i < $scope.todoList.length; i++){
            if ($scope.todoList[i]._id == data2._id) {
                console.log($scope.todoList[i], data2);
                var startPos = i;
            }
        }
        console.log('start', startPos);
        if (startPos > index) {
            $scope.todoList.splice(index, 0, $scope.todoList[startPos]);
            $scope.todoList.splice(startPos + 1, 1);
        } else {
            $scope.todoList.splice(index + 1, 0, $scope.todoList[startPos]);
            $scope.todoList.splice(startPos, 1);
        }
    };
}

function operationService($http) {
    return {
        get: function () {
            return $http.get('/api/v1/todo');
        },
        post: function (data) {
            return $http.post('/api/v1/todo', data);
        },
        delete: function (id, data) {
            return $http.delete('/api/v1/todo/'+ id, data)
        },
        put: function (id, data) {
            return $http.put('/api/v1/todo/'+ id, data)
        }
    }
}

function itemTodo() {
    return {
        restrict: "EA",
        scope: {
            delTodo: "&",
            edTodo: "&",
            checkTodo: "&",
            todo: "="
        },
        template: '<md-list-item  ng-drag="true" ng-drag-data="todo" ng-animate="animate">' +
        '<md-checkbox class="md-secondary" ng-model="todo.done" ng-change="checkTodo({index: $index})"></md-checkbox>' +
        '<p ng-class="{\'done\': todo.done}">{{todo.value}}</p>' +
        '<md-button class="md-raised md-accent md-hue-3" ng-click="delTodo({index: $index})">Delete</md-button>' +
        '<md-button class="md-raised md-warn md-hue-3" ng-click="edTodo({index: $index})">Edit</md-button>' +
        '</md-list-item>',
    };
}
