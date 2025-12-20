-- Add UPDATE policy for recommendations (users can update their own property recommendations)
CREATE POLICY "Users can update own property recommendations" 
ON public.recommendations 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM properties 
  WHERE properties.id = recommendations.property_id 
  AND properties.user_id = auth.uid()
));

-- Add DELETE policy for recommendations (users can delete their own property recommendations)
CREATE POLICY "Users can delete own property recommendations" 
ON public.recommendations 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM properties 
  WHERE properties.id = recommendations.property_id 
  AND properties.user_id = auth.uid()
));