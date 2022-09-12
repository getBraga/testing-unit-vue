<template>
  <img src="../img/tr.png" @click="$i18n.locale = 'tr'" title="Türkçe" />
  <img src="../img/en.png" @click="$i18n.locale = 'en'" title="English" />
  <img
    src="../img/ptBR.png"
    @click="$i18n.locale = 'ptBR'"
    title="Portuguese"
  />
</template>

<style scoped>
img {
  cursor: pointer;
}
</style>
