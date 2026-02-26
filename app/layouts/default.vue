<script setup lang="ts">
</script>
<template>
  <div class="app">
    <aside class="sidebar-wrapper p-2 bg-800">
      <div class="sidebar">
        <h1>GrowApple</h1>
        <nav class="nav flex-column">
          <NuxtLink class="nav-link" aria-current="page" href="#">Home</NuxtLink>
          <NuxtLink class="nav-link" href="/apple">Apples</NuxtLink>
          <NuxtLink class="nav-link" href="/bubbles">Bubbles</NuxtLink>
        </nav>
      </div>
    </aside>

    <div class="page-wrapper">
      <main class="scroll-container">
        <div class="page-content">
          <NuxtPage />
        </div>
      </main>

      <footer class="footer">
        Footer Content (Only visible at bottom)
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";

.sidebar-wrapper {
  display: none;
  position: absolute;
  height: 100%;
  width: 100%;

  @include media-breakpoint-up('sm') {
    position: static;
    display: block;
    width: auto;
    height: auto;
  }

  &.__opened {
    display: block;
    top: 0;
    left: 0;
  }

  .nav {
    --bs-nav-link-hover-color: var(--bs-teal-600);

    .nav-link.active {
      color: white;
    }
  }
}

/* Optional: Customizing the base nav-link behavior */
.nav-link {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;
}

.app {
  display: grid;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;

  grid-template-areas:
    "sidebar main";
  ;

  @include media-breakpoint-up('sm') {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 1fr 120px;
  }
}

.sidebar-wrapper {
  height: 100dvh;
  overflow: hidden;
  grid-area: sidebar;
}

.page-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  grid-area: main;
  //height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: contain;
  -webkit-overflow-scrolling: touch;
}

.scroll-container {
  display: flex;
  flex-direction: column;
  /* min-height: 100% ensures the container is at least as tall as the screen */
  //min-height: 100%;
}

.page-content {
  flex: 1 0 auto;
  padding: 20px;
}

.footer {
  //flex-shrink: 0;
  padding: 40px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 3px 9px 2px rgba(255, 255, 255, .2)
  /* width: 100% is fine, but as a flex item it's already fill-width */
}
</style>