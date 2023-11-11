<template>
  <div>
    <!-- Navigation bar with subnavigation in a slot -->
    <header>
      <nav class="w-full border-gray-200">
        <div class="mx-auto max-w-screen-xl flex flex-row items-center justify-between px-4 py-2">
          <h1>Ina Délice Marque 4</h1>

          <DarkToggle />
        </div>
      </nav>
    </header>

    <!-- Main place -->
    <main>
      <slot />
    </main>
  </div>
</template>
