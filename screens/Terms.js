import { View, Text, ScrollView } from 'react-native'
import React from 'react'

export default function Terms() {
  return (
    <ScrollView className="h-full mt-2 w-[90%] ">
      <View className="items-center">
        <Text className="text-slate-900 font-bold text-lg">Smluvní podmínky</Text>
        <Text className="text-slate-900 text-base my-2">
          Aplikace Jídelák vznikla jako bakalářská práce na téma Multiplatformní mobilní aplikace v React Native, autorem je Jan Vlček.
          Aplikace využívá a sbírá různá data od uživatelů, která jsou následně ukládána v databázi.
          Databáze je řádně a vhodně zabezpečena. Sbíraná data jsou využívána k výpočtu denních makroživin a z nich mohou vznikat různá doporučení.
          Sbíranými daty jsou mimo osobních údajů záznamy o oblíbených receptech, nákupních seznamech a jednotlivých jídlech v průběhu dne.
          Z jednotlivých zaznamenávaných jídel je možné uživatelem zobrazit statistiky pro vybrané období a může se podívat na své stravování v průběhu uplynulých dní.
        </Text>
        <Text className="text-slate-900 text-base my-2">
          Autor nenese žádnou odpovědnost za správnost údajů a nenese ani žádné záruky a odpovědnost za škody nebo újmu vzniklou používáním aplikace Jídelák.
          Autor aplikace se zříká jakékoliv zodpovědnosti za nevhodná doporučení vzniklá v aplikaci a ve všech případech je vhodné se poradit s odborníkem.
          Aplikace se řídí ochranou osobních údaju, které nejsou popsány přímo v těchto podmínkách.
          Aplikace je zcela bezplatná a nevyžaduje žádné platby. Autor aplikace si vyhrazuje právo na jakékoliv změny v těchto smluvních podmínkách. O změnách upozorní minimálně 30 dní předem.
          Autor aplikace není vlastníkem obrázků jednotlivých pokrmů v aplikaci.
        </Text>
        <Text className="text-slate-900 text-base font-bold"> Smluvní podmínky platné a účinné od 20.3.2024.</Text>
      </View>
    </ScrollView>
  )
}