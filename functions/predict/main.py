from os import path
from google.cloud.storage.blob import Blob
import pandas as pd
from flask import escape
from google.cloud import storage
from joblib import load
from pandas.io import json

storage_client = storage.Client()

def load_model():
  bucket_name = "wind-power-forecasting-models"
  bucket = storage_client.get_bucket(bucket_name)
  blob = bucket.blob("gradient-boosting.joblib")
  blob.download_to_filename("/tmp/gradient-boosting.joblib")
  model = load(open("/tmp/gradient-boosting.joblib", 'rb'))
  return model


def load_forecasting_data(path):
  df = pd.read_csv(path)
  return df


def cat_var_management(df,col_name):
  df_dummy = pd.get_dummies(df[col_name],prefix='M')
  df_new = pd.concat([df, df_dummy], axis=1)
  df_new = df_new.drop(col_name, axis = 1)
  return df_new


def get_prediction(input_data, model):
  print(input_data.drop(['Date_time'], axis=1))
  predicted = model.predict(input_data.drop(['Date_time'], axis=1))
  return pd.concat([pd.DataFrame({'predicted': predicted}), pd.Series(input_data['Date_time']).reset_index(drop=True)], axis=1)


def save_results_to_gcs(name, results):
  bucket_name = 'wind-power-forecasting-results'
  bucket = storage_client.get_bucket(bucket_name)
  blob = Blob(name + '.csv', bucket)
  blob.upload_from_string(results)
  blob.make_public()
  return blob.public_url


def main(request):
    print('Starting prediction...')
    model = load_model()

    request_json = request.get_json(silent=True)
    print(request_json)

    if request_json and 'csvPath' and 'analysisName' in request_json:
      csv_path = request_json['csvPath']
      name = request_json['analysisName']
      data = load_forecasting_data(csv_path)
      predicted = get_prediction(data, model)
      print('Prediction ended. Saving results to bucket...')

      data_location = save_results_to_gcs(name, predicted.to_csv(index=False))

      return {'name': name, 'dataLocation': data_location }
    else:
      raise ValueError("JSON is invalid, or missing a 'csv_path' property")
