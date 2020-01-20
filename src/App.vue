<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href="#" class="navbar-brand">Here</a>
        <div class="navbar-nav mr-auto">
          <li class="nav-item">
            <a href="/products" class="nav-link">Produkty</a>
          </li>
          <li class="nav-item">
            <a href="/add" class="nav-link">Dodaj</a>
          </li>
          <li class="nav-item">
            <a href="/cart" class="nav-link">Koszyk</a>
          </li>
        </div>
        <div class="navbar-nav ml-auto">
          <li class="nav-item">
            <a href="/allOrders" class="nav-link">Zamówienia</a>
          </li>
        </div>
    </nav>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
nav ul li:last-child {float: right; }
</style>

