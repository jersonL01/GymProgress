import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DATASET_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

type ExerciseApiItem = {
  id: string;
  name: string;
  force?: string | null;
  level?: string | null;
  mechanic?: string | null;
  equipment?: string | null;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  category?: string | null;
  images?: string[];
};

function mapValue(value?: string | null) {
  if (!value) return null;

  const map: Record<string, string> = {
    strength: "fuerza",
    stretching: "estiramiento",
    cardio: "cardio",
    powerlifting: "powerlifting",
    strongman: "strongman",
    olympic_weightlifting: "levantamiento olímpico",
    plyometrics: "pliometría",

    push: "empuje",
    pull: "tirón",
    static: "estático",

    beginner: "principiante",
    intermediate: "intermedio",
    expert: "avanzado",

    isolation: "aislado",
    compound: "compuesto",

    machine: "máquina",
    barbell: "barra",
    dumbbell: "mancuerna",
    cable: "polea",
    kettlebells: "kettlebell",
    kettlebell: "kettlebell",
    bands: "bandas",
    band: "banda",
    body_only: "peso corporal",
    other: "otro",
    exercise_ball: "pelota de ejercicio",
    foam_roll: "foam roller",
    e_z_curl_bar: "barra EZ",
    medicine_ball: "balón medicinal",
  };

  return map[value] ?? value;
}

function mapMuscle(value: string) {
  const map: Record<string, string> = {
    abdominals: "abdominales",
    abductors: "abductores",
    adductors: "aductores",
    biceps: "bíceps",
    calves: "pantorrillas",
    chest: "pecho",
    forearms: "antebrazos",
    glutes: "glúteos",
    hamstrings: "isquiotibiales",
    lats: "dorsales",
    lower_back: "espalda baja",
    middle_back: "espalda media",
    traps: "trapecios",
    neck: "cuello",
    quadriceps: "cuádriceps",
    shoulders: "hombros",
    triceps: "tríceps",
  };

  return map[value] ?? value;
}

function translateName(name: string) {
  const map: Record<string, string> = {
    Squat: "Sentadilla",
    Deadlift: "Peso muerto",
    "Bench Press": "Press banca",
    "Pull-Up": "Dominada",
    "Chin-Up": "Chin-up",
    Row: "Remo",
    Curl: "Curl",
    Triceps: "Tríceps",
    "Lateral Raise": "Elevación lateral",
    "Leg Press": "Prensa de piernas",
    "Leg Extension": "Extensión de pierna",
    "Leg Curl": "Curl femoral",
    "Calf Raise": "Elevación de pantorrillas",
    "Shoulder Press": "Press militar",
    Incline: "Inclinado",
    Dumbbell: "Mancuerna",
    Barbell: "Barra",
    Cable: "Polea",
  };

  let translated = name;
  for (const [en, es] of Object.entries(map)) {
    translated = translated.replaceAll(en, es);
  }

  return translated;
}

function translateInstructions(instructions: string[]) {
  return instructions.map((step) =>
    step
      .replaceAll("Sit", "Siéntate")
      .replaceAll("Stand", "Párate")
      .replaceAll("Lie down", "Acuéstate")
      .replaceAll("Hold", "Sostén")
      .replaceAll("Raise", "Eleva")
      .replaceAll("Lower", "Baja")
      .replaceAll("slowly", "lentamente")
  );
}

async function main() {
  const response = await fetch(DATASET_URL);

  if (!response.ok) {
    throw new Error("No se pudo descargar el dataset de ejercicios");
  }

  const exercises = (await response.json()) as ExerciseApiItem[];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: {
        externalId: exercise.id,
      },
      update: {
        name: exercise.name,
        nameEs: translateName(exercise.name),
        category: exercise.category ?? null,
        categoryEs: mapValue(exercise.category),
        force: exercise.force ?? null,
        forceEs: mapValue(exercise.force),
        level: exercise.level ?? null,
        levelEs: mapValue(exercise.level),
        mechanic: exercise.mechanic ?? null,
        mechanicEs: mapValue(exercise.mechanic),
        equipment: exercise.equipment ?? null,
        equipmentEs: mapValue(exercise.equipment),
        primaryMuscles: exercise.primaryMuscles ?? [],
        primaryMusclesEs: (exercise.primaryMuscles ?? []).map(mapMuscle),
        secondaryMuscles: exercise.secondaryMuscles ?? [],
        secondaryMusclesEs: (exercise.secondaryMuscles ?? []).map(mapMuscle),
        instructions: exercise.instructions ?? [],
        instructionsEs: translateInstructions(exercise.instructions ?? []),
        images: (exercise.images ?? []).map(
          (img) =>
            `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`
        ),
      },
      create: {
        externalId: exercise.id,
        name: exercise.name,
        nameEs: translateName(exercise.name),
        category: exercise.category ?? null,
        categoryEs: mapValue(exercise.category),
        force: exercise.force ?? null,
        forceEs: mapValue(exercise.force),
        level: exercise.level ?? null,
        levelEs: mapValue(exercise.level),
        mechanic: exercise.mechanic ?? null,
        mechanicEs: mapValue(exercise.mechanic),
        equipment: exercise.equipment ?? null,
        equipmentEs: mapValue(exercise.equipment),
        primaryMuscles: exercise.primaryMuscles ?? [],
        primaryMusclesEs: (exercise.primaryMuscles ?? []).map(mapMuscle),
        secondaryMuscles: exercise.secondaryMuscles ?? [],
        secondaryMusclesEs: (exercise.secondaryMuscles ?? []).map(mapMuscle),
        instructions: exercise.instructions ?? [],
        instructionsEs: translateInstructions(exercise.instructions ?? []),
        images: (exercise.images ?? []).map(
          (img) =>
            `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`
        ),
      },
    });
  }

  console.log("Ejercicios importados correctamente");
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });