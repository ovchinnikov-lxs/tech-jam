<template>
    <div>
    <pre>
      {{ data }}
      </pre>
    </div>
</template>


<script setup lang="ts">
const {data} = await useAsyncData(() => Promise.all([$fetch('https://jsonplaceholder.typicode.com/posts'), $fetch('/server-test')]))
</script>
