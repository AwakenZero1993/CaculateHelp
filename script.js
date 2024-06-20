body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 300px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type="number"] {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #218838;
}

.error-message {
    color: red; /* Màu chữ đỏ */
    display: none;
    margin-bottom: 10px;
    font-weight: bold;
}

.error-message.active {
    display: block;
}

#result {
    margin-top: 20px;
    text-align: center;
}

#input-values {
    display: none;
    margin-top: 10px;
}

#input-values p {
    margin: 5px 0;
}

#copy-values {
    display: none;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#copy-values:hover {
    background-color: #0056b3;
}

#success-message {
    color: green;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
}

#remaining-stat {
    margin-top: 10px;
    font-weight: bold;
    text-align: center;
}
