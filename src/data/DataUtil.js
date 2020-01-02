import * as tf from "@tensorflow/tfjs";

export const split_sequences = (sequence, n_steps) => {
  return new Promise(resolve => {
    let seq_x = [];
    let seq_y = [];

    for (let i = 0; i < sequence.length; i++) {
      let end_ix = i + n_steps;
      console.debug(` i: ${i} end_ix:${end_ix}`);
      if (end_ix > sequence.length) break;
      seq_x.push(sequence.slice(i, end_ix));
      seq_y.push(sequence[end_ix - 1]);
    }

    resolve({ seq_x, seq_y });
  });
};

export const train = async (
  n_steps,
  epochs,
  n_features,
  timeID,
  depVar,
  seq_x,
  seq_y,
  onEpochEnd
) => {
  let ten_X = tf.tensor2d(seq_x, [seq_x.length, n_steps]);
  let ten_y = tf.tensor1d(seq_y);

  let model = tf.sequential();
  model.add(
    tf.layers.lstm({
      units: 50,
      activation: "relu",
      inputShape: [n_steps, n_features]
    })
  );
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"]
  });
  ten_X = ten_X.reshape([ten_X.shape[0], n_steps, n_features]);

  await model.fit(ten_X, ten_y, {
    epochs: epochs,
    callbacks: {
      onEpochEnd: onEpochEnd
    }
  });

  return new Promise(resolve => {
    resolve(model);
  });
};

export const predict = (timeID, n_steps, n_features, model, seq_x) => {
  return new Promise(resolve => {
    let ten_X = tf.tensor2d(seq_x, [seq_x.length, n_steps]);
    ten_X = ten_X.reshape([ten_X.shape[0], n_steps, n_features]);
    let predictions = [];
    let count = 0;

    // predictions = df
    //   .select(timeID)
    //   .slice(n_steps - 1)
    //   .toArray()
    predictions = seq_x.map(date => {
      let predicted = model.predict(ten_X.slice(count, 1));
      count++;

      return predicted.dataSync()[0];
    });

    resolve({ predictions: predictions });
  });
};
